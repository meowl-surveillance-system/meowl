let nodemailer = require('nodemailer');
const Email = require('email-templates');

require('dotenv').config({ path: '../keys.env'});

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

function sendEmail(req: any) {
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

exports.sendEmail = sendEmail;