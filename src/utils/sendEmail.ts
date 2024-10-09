import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.",
    port: 587,
    secure: config.node_env === "production",
    auth: {
      user: "safarahafkhan@gmail.com",
      pass: "csgx lkpq qore tiii",
      // pass: config.user_pass,
    },
  });

  await transporter.sendMail({
    from: "safaragak@gmail.com",
    to,
    subject: "Reset your password within ten mins!",
    text: "",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link is valid for 2 hours.</p>`,
  });
};
