import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { PostRoutes } from "../modules/posts/post.routes";
import { CommentRoutes } from "../modules/comments/comment.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/posts",
    route: PostRoutes,
  },
  {
    path: "/comments",
    route: CommentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
