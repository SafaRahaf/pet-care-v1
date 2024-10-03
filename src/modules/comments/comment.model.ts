import { Schema, model } from "mongoose";
import { IComment } from "./comment.interface";

const commentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", commentSchema);
export default Comment;
