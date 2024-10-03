import mongoose, { Schema, model } from "mongoose";

export interface IComment extends Document {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
