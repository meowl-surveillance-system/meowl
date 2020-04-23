import sendEmail from './sendEmail';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

let sendMailMock: jest.Mock<any, any>;

beforeEach(() => {
    sendMailMock = jest.fn();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({sendMail: sendMailMock});
})

it('should call nodemailer function', () => {
    const req = {
        'test': 'dummy',
        locals: {
            img: 'img'
        }
    }
    sendEmail(req);
    expect(sendMailMock).toHaveBeenCalled;

});