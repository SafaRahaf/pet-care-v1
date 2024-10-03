import Comment from "./comment.model";
import { IComment } from "./comment.interface";
import Post from "../posts/post.model";

const createComment = async (payload: IComment) => {
  const comment = await Comment.create(payload);
  await Post.findByIdAndUpdate(payload.post, {
    $push: { comments: comment._id },
  });
  return comment;
};

const getCommentsByPost = async (postId: string) => {
  const comments = await Comment.find({ post: postId }).populate(
    "author",
    "name"
  );
  return comments;
};

export const CommentServices = {
  createComment,
  getCommentsByPost,
};
