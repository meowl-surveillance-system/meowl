const nodemailer = require('nodemailer');
require('dotenv').config({ path: './keys.env'});

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});


const message = {
    from: 'Meowl Notification Service', // Sender address
    to: 'recipient@email.com',         // List of recipients
    subject: 'This is a test email', // Subject line
    text: 'If you receive this message, nodemailer works!' // Plain text body
};

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

transporter.sendMail(message, function(err, info) {
    if (err) {
        console.log(err)
    } else {
        console.log(info);
    }
});