const nodemailer = require('nodemailer');
const fs=require('fs');
var dotenv=require('dotenv');
dotenv.config();

let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth:{
            user:process.env.uid, // generated ethereal user
            pass:process.env.pass  
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'shubhodeep paul', // sender address
        to: 'nachiket.kate@gslab.com', // list of receivers
        subject: 'd3-poc✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<img src="cid:popu"/><br><img src="cid:line"/>', // html body
        attachments:[
            {
                filename:"screenshot.png",
                content:fs.createReadStream("screenshot.png"),
                cid:'popu'
            },
            {
            filename:"lineChart.png",
            content:fs.createReadStream("lineChart.png"),
            cid:"line"
            }
        ]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions,(error, info)=>{
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });