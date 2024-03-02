const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com", // Your Gmail address
    pass: "yourpassword", // Your Gmail password or App Password if 2FA is enabled
  },
});

let mailOptions = {
  from: "yourgmail@gmail.com", // Sender address
  to: "recipient@example.com", // List of recipients
  subject: "Test Email", // Subject line
  text: "This is a test email sent from Node.js using Nodemailer.", // Plain text body
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error occurred:", error.message);
  } else {
    console.log("Email sent successfully!", info.response);
  }
});
