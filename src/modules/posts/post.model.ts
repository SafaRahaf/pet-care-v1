import { Schema, model } from "mongoose";
import { IPost } from "./post.interface";

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    category: { type: String, enum: ["Tip", "Story"], required: true },
    isPremium: { type: Boolean, default: false },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post = model<IPost>("Post", postSchema);

export default Post;
