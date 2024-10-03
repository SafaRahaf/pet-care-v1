import express from "express";
import { CommentControllers } from "./comment.controller";
import auth from "../../middlewares/auth";
import { ROLE } from "../user/user.constant";

const router = express.Router();

router.post("/", auth(ROLE.admin, ROLE.user), CommentControllers.createComment);

router.get("/:postId", CommentControllers.getCommentsByPost);

export const CommentRoutes = router;
