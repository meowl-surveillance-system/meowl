const index = require('./index');
const nodemail = require('nodemailer');

jest.mock('nodemailer');

let sendMailMock: jest.Mock<any, any>;

beforeEach(() => {
    sendMailMock = jest.fn();
    nodemail.createTransport.mockReturnValue({sendMail: sendMailMock});
})

it('should call nodemailer function', () => {
    const req = {
        'test': 'dummy'
    }
    index.sendEmail(req);
    expect(sendMailMock).toHaveBeenCalled;

});