import nodemailer from 'nodemailer';
import { EMAIL, EMAIL_PASSWORD, REACT_SERVER_IP } from './settings';

export const sendEmail = async (recipient: string, token: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    const emailOptions = {
      to: recipient,
      from: 'Meowl Password Reset Service',
      subject: 'Meowl Password Reset',
      text:
        'You (or someone else) requested a password reset of a Meowl account using this email address.\n\n' +
        'If you have requested for a password reset please click on the following link to begin the password reset process:\n\n' +
        `${REACT_SERVER_IP}/reset-password/${token}\n\n` +
        'If you did not request for a password rest, please ignore this email.',
    };

    const info = await transporter.sendMail(emailOptions);
    console.log(info);
  } catch (e) {
    console.error(e);
  }
};
