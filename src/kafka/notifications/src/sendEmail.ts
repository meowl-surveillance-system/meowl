import * as Email from 'email-templates';
import * as nodemailer from 'nodemailer';
import {EMAIL_ADDRESS, EMAIL_PASSWORD} from './settings';

/*
 *  @param: req - JSON object that contains information necessary to construct
 * notification email to be sent. req contains the following properties:
 * template - email template to be used, recipient - receiver of notification,
 * locals - information necessary to specific notification being sent i.e.
 * image, name of person identified, etc.
 *
 *  Sends an email for a notification based on information received from req
 */
export default function sendEmail(req: any) {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD}
  });

  const email = new Email({
    message: {
      from: 'Meowl Notification Service',
      attachments: [{filename: 'detected.jpg', path: req.locals.img}]
    },
    transport: transporter,
    send: true,
    preview: false,
  });

  email
      .send({
        template: req.template,
        message: {to: req.recipient},
        locals: req.locals,
      })
      .catch(console.error);
}