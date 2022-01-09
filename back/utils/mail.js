const nodemailer = require("nodemailer")

const sendEmail = async (email, subject, payload) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PW
    }
  })

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject,
    html: payload
  }

  const infos = await transporter.sendMail(mailOptions)
  console.log(infos.response)
}

module.exports = sendEmail