import mongoose, { Schema, model } from "mongoose";

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  title: string;
  content: string;
  imageUrl?: string;
  category: "Tip" | "Story";
  isPremium?: boolean;
  upvotes: number;
  downvotes: number;
  comments: mongoose.Types.ObjectId[];
}
