import bcrypt from 'bcrypt';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import {
  isLoggedIn,
  isLoggedOut,
  isUsernameCollide,
  isValidCred,
} from '../middlewares/authChecks';
import { client } from '../utils/client';

const app = express();
import {
  INSERT_USERSID,
  INSERT_USERSNAME,
  SELECT_USERSID_USERID_PASSWORD,
  UPDATE_USERSID_SID,
  UPDATE_USERSNAME_SID,
  SELECT_USERSNAME_SID,
} from '../utils/queries';

app.post(
  '/register',
  [isLoggedOut, isValidCred, isUsernameCollide],
  (req: express.Request, res: express.Response) => {
    const { username, password } = req.body;
    const sid = req.sessionID;
    const userId = uuidv4();

    bcrypt.hash(password, 12, (err, hash) => {
      const params = [userId, username, hash, sid];
      client.execute(INSERT_USERSID, params, { prepare: true });
      client.execute(INSERT_USERSNAME, params, { prepare: true });
    });
    req.session!.userId = userId;
    res.status(200).send('successfully registered');
  }
);

app.post(
  '/login',
  [isLoggedOut, isValidCred],
  (req: express.Request, res: express.Response) => {
    const { username, password } = req.body;
    const sid = req.sessionID;

    client.execute(
      SELECT_USERSID_USERID_PASSWORD,
      [username],
      { prepare: true },
      (err: Error, result) => {
        if (err) {
          console.log(err);
          res.status(400).send('Bad request');
        } else {
          const id = result.rows[0].user_id;
          const hash = result.rows[0].password;

          bcrypt.compare(password, hash, (error, match) => {
            if (error) {
              console.log(error);
            } else if (match) {
              client.execute(UPDATE_USERSID_SID, [sid, id], {
                prepare: true,
              });
              client.execute(UPDATE_USERSNAME_SID, [sid, username], {
                prepare: true,
              });
              req.session!.userId = id;
              res.status(200).send('sucessfully logged in');
            } else {
              res.status(400).send('Invalid username or password');
            }
          });
        }
      }
    );
  }
);

app.post(
  '/logout',
  isLoggedIn,
  (req: express.Request, res: express.Response) => {
    req.session!.destroy(err => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send('logged out');
      }
    });
  }
);

app.post(
  '/rtmpRequest',
  isLoggedIn,
  (req: express.Request, res: express.Response) => {
    res
      .status(200)
      .json({ sessionID: req.sessionID, userId: req.session!.userId });
  }
);

app.get('/rtmpAuth', async (req: express.Request, res: express.Response) => {
  const result = await client.execute(SELECT_USERSNAME_SID, [req.body.userId], {
    prepare: true,
  });
  if (result.rows.length === 0 || result.rows[0].sid !== req.body.sessionID) {
    res.status(400).send('Nice try kid');
  } else {
    res.status(200).send('OK');
  }
});

module.exports = app;
