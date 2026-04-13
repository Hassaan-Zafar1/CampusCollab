const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text, htmlContent = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text
    };

    // Add HTML content if provided
    if (htmlContent) {
      mailOptions.html = htmlContent;
    }

    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
  } catch (error) {
    console.log('Email not sent:', error);
  }
};

module.exports = sendEmail;