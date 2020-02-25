const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/api/getVideo', function (req, res) {
    const spawn = require('child_process').spawn;
    const pyProc = spawn('python', ['./sendVid.py'])
    pyProc.stdout.on('data', function(vid) {
        res.send(Buffer.from(vid));
        // console.log('Sent video back.')
    })
})

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});