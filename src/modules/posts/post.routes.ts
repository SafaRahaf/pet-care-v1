import express from "express";
import auth from "../../middlewares/auth";
import { ROLE } from "../user/user.constant";
import { PostControllers } from "./post.controller";
import upload from "../../config/multer";

const router = express.Router();

router.post(
  "/create",
  auth(ROLE.admin, ROLE.user),
  // upload.single("image"),
  PostControllers.createPost
);

router.get("/", PostControllers.getPosts);

router.put(
  "/update/:postId",
  auth(ROLE.admin, ROLE.user),
  PostControllers.updatePost
);
router.delete(
  "/delete/:postId",
  auth(ROLE.admin, ROLE.user),
  PostControllers.deletePost
);

router.post(
  "/upvote/:postId",
  auth(ROLE.admin, ROLE.user),
  PostControllers.upvotePost
);
router.post(
  "/downvote/:postId",
  auth(ROLE.admin, ROLE.user),
  PostControllers.downvotePost
);

export const PostRoutes = router;
