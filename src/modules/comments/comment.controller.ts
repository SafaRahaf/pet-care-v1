import catchAsync from "../../utils/catchAsync";
import { CommentServices } from "./comment.service";
import { IComment } from "./comment.interface";

const createComment = catchAsync(async (req, res) => {
  const { post, content } = req.body;

  if (!post || !content) {
    return res.status(400).json({
      success: false,
      message: "Post ID and content are required.",
    });
  }

  //@ts-ignore
  const author = req.user.id;

  // @ts-ignore
  const commentData: IComment = {
    post,
    author,
    content,
  };

  const result = await CommentServices.createComment(commentData);

  res.status(201).json({
    success: true,
    message: "Comment added successfully!",
    data: result,
  });
});

const getCommentsByPost = catchAsync(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({
      success: false,
      message: "Post ID is required.",
    });
  }

  const comments = await CommentServices.getCommentsByPost(postId);

  res.status(200).json({
    success: true,
    data: comments,
  });
});

export const CommentControllers = {
  createComment,
  getCommentsByPost,
};
