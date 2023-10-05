const nodemailer=require("nodemailer")

  async function sendmail(){
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.user,
      pass: process.env.pass
    }
  });
  
 
  const mailOptions = {
    from: process.env.user,
    to: process.env.to,
    subject: 'Total orders info',
    text: 'This is  All order detailes',
    attachments: [
      {
        filename: 'output.xlsx',
        path: `C:\\Users\\admin\\Desktop\\task2nodejs\\output.xlsx`   
      }
    ]
  };
  
 
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent successfully:', info.response);
    }
  })
}
  module.exports=sendmail
  