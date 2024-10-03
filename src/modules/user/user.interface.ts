import { ROLE } from "./user.constant";
import { Types } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  password: string;
  posts?: Types.ObjectId;
  followers?: Types.ObjectId;
  following?: Types.ObjectId;
  role: keyof typeof ROLE;
};
