import catchAsync from "../../utils/catchAsync";
import { PostServices } from "./post.service";

const createPost = catchAsync(async (req, res) => {
  const result = await PostServices.createPosts(
    req.body
    // , req
  );

  res.status(200).json({
    success: true,
    message: "post is created successfully!",
    data: result,
  });
});

const getPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPost();

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully!",
    data: result,
  });
});

const upvotePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const result = await PostServices.upvotePost(postId);
  res.status(200).json({
    success: true,
    message: "Post upvoted successfully!",
    data: result,
  });
});

const downvotePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const result = await PostServices.downvotePost(postId);
  res.status(200).json({
    success: true,
    message: "Post downvoted successfully!",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  //@ts-ignore
  const userId = req.user.id;
  const result = await PostServices.updatePost(postId, userId, req.body);

  res.status(200).json({
    success: true,
    message: "Post updated successfully!",
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  //@ts-ignore
  const userId = req.user.id;
  await PostServices.deletePost(postId, userId);

  res.status(200).json({
    success: true,
    message: "Post deleted successfully!",
  });
});

export const PostControllers = {
  createPost,
  getPosts,
  upvotePost,
  downvotePost,
  deletePost,
  updatePost,
};
