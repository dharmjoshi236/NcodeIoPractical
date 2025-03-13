const nodemailer = require('nodemailer');
const { envConstants } = require('../constants/envConstants');

// auth key apocvexxcobwqkqx

const sendPdfInMailToUser = async (pdfBufferData, toEmail, invoiceId, pdfFileName) => {
    try {
         let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: envConstants.fromEmail,
                pass: envConstants.emailAuth
            }
         });

         let mailOptionJson = {
            from: envConstants.fromEmail,
            to: toEmail,
            subject: "Invoice from NCode.io",
            text: `Please find your generated invoice. Your invoice id is ${invoiceId}`,
            attachments: [
                {
                    filename: pdfFileName,
                    content: pdfBufferData,
                    contentType: 'application/pdf'
                }
            ]
         }

         let sendMail = await mailTransporter.sendMail(mailOptionJson);

         if (sendMail.messageId) {
            return 1;
         } else {
            return 0; 
         }
    } catch (error) {
        console.log("Error in sending email to the user ", error);
        throw error;
    }
}

module.exports = {
    sendPdfInMailToUser
}