// TODO: Set up the application so that cors is only used for development
import cors from 'cors';
import express from 'express';

const app = express();
const port = process.env.PORT || 8081;

// TODO: Set up the app so that cors is only used for development
app.use(cors());
app.get('/', function(req, res) {
  res.send('Hello World!');
});

// TODO(Akasora39): Fix the buffer stream
app.get('/api/getVideo', function(req, res) {
  const spawn = require('child_process').spawn;
  const pyProc = spawn('python', ['./sendVid.py'])
  pyProc.stdout.pipe(res, {end: true});
  pyProc.stdin.on('end', function() {
    console.log('done');
    res.send();
    return res.end();
  });
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
});