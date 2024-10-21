import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.MONGO_URI,
  salt_round: process.env.SALT_ROUND || 12,
  jwt_access_secret: process.env.JWT_SECRET,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  from_email: process.env.EMAIL_FROM,
  user_email: process.env.EMAIL_USER,
  user_pass: process.env.EMAIL_PASS,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
};
