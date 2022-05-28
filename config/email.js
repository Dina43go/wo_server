const path = require('path');
require('dotenv').config({path : path.join(__dirname ,"..",".env")});

const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});


const mailOption = (to , html , subject="Envoie de mot de passe")=>{
    let mailOptions = {};
    mailOptions.to = to;
    mailOptions.from = process.env.EMAIL;
    mailOptions.subject = subject;
    mailOptions.html = html;
    return mailOptions;
}



module.exports = {transporter , mailOption};
 