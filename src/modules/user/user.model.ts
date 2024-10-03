import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import { ROLE } from "./user.constant";
import bcryptjs from "bcryptjs";
import config from "../../config";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: Object.keys(ROLE),
      default: ROLE.user,
    },
    posts: {
      type: [Schema.Types.ObjectId],
      ref: "Post",
      default: [],
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  try {
    if (user.isModified("password")) {
      user.password = await bcryptjs.hash(
        user.password,
        Number(config.salt_round) || 10
      );
    }
    next();
  } catch (error: any) {
    next(error);
  }
});
userSchema.post("save", function (doc, next) {
  doc.password = "";

  next();
});

export const User = model<TUser>("User", userSchema);
