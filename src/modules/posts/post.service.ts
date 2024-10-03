import cloudinary from "../../utils/cloudinary";
import { IPost } from "./post.interface";
import Post from "./post.model";

const createPosts = async (
  // req: any,
  payload: IPost
) => {
  const post = await Post.create(payload);

  // const file = req.file; // Access the file from the request
  // let imageUrl = "";

  // if (file) {
  //   try {
  //     //@ts-ignore
  //     const result = await cloudinary.v2.uploader.upload(file.path);

  //     // Check if the upload was successful
  //     if (result && result.secure_url) {
  //       imageUrl = result.secure_url;
  //       post.imageUrl = imageUrl; // Save the image URL to the post
  //       await post.save(); // Save the post with the image URL
  //     } else {
  //       throw new Error("Image upload failed. No secure URL returned.");
  //     }
  //   } catch (error) {
  //     // Handle upload error
  //     console.error("Error uploading image to Cloudinary:", error);
  //     throw new Error("Image upload failed.");
  //   }
  // }

  return post;
};

const getAllPost = async () => {
  const users = await Post.find();
  return users;
};

const upvotePost = async (postId: string) => {
  return await Post.findByIdAndUpdate(
    postId,
    { $inc: { upvotes: 1 } },
    { new: true }
  );
};

const downvotePost = async (postId: string) => {
  return await Post.findByIdAndUpdate(
    postId,
    { $inc: { downvotes: 1 } },
    { new: true }
  );
};

const updatePost = async (
  postId: string,
  userId: string,
  updates: Partial<IPost>
) => {
  const post = await Post.findById(postId);

  if (post!.author.toString() !== userId) {
    throw new Error("You are not authorized to update this post.");
  }
  return await Post.findByIdAndUpdate(postId, updates, { new: true });
};

const deletePost = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);
  // .sort({ createdAt: -1 });

  if (post!.author.toString() !== userId) {
    throw new Error("You are not authorized to delete this post.");
  }
  await Post.findByIdAndDelete(postId);
};

export const PostServices = {
  getAllPost,
  createPosts,
  upvotePost,
  downvotePost,
  deletePost,
  updatePost,
};
