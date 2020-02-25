const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/api/getVideo', function (req, res) {
    const spawn = require('child_process').spawn;
    const pyProc = spawn('python', ['path/script.py', req.query.start, req.query.id])
    pyProc.stdout.on('vid', function(vid) {
        res.sendFile(vid)
        console.log('Sent video back.')
    })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});