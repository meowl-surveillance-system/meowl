const nodemailer = require('nodemailer');
const Email = require('email-templates');

require('dotenv').config({ path: './keys.env'});

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const email = new Email({
    message: {
        from: 'Meowl Notification Service'
    },
    transport: transporter,
    send: true,
    preview: false
});

function sendEmail(req) {
    email.send({
        template: req.template,
        message: {
            to: req.recipient
        },
        locals: req.locals
    })
    .catch(console.error);
}

const req1 = {
    template: 'blacklist',
    recipient: 'meowl.notifications@gmail.com',
    locals: {
        name: 'Andy',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/220px-SNice.svg.png'
    }
}

sendEmail(req1)

/*const message = {
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
});*/