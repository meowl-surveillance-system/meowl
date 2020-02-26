import express from 'express';
const app = express();
const port = process.env.PORT || 8081;

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/api/getVideo', function(req, res) {
  const spawn = require('child_process').spawn;
  const pyProc = spawn('python', ['./sendVid.py'])
  pyProc.stdout.on('data', function(vid) {
    res.send(Buffer.from(vid));
    // console.log('Sent video back.')
  })
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
});