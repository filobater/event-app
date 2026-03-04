import nodemailer from "nodemailer";

interface IEmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: IEmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: "eventify@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
