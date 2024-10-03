import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.",
    port: 587,
    secure: config.node_env === "production",
    auth: {
      user: config.user_email,
      pass: config.user_pass,
    },
  });

  await transporter.sendMail({
    from: "mezbaul@programming-hero.com",
    to,
    subject: "Reset your password within ten mins!",
    text: "",
    html,
  });
};
