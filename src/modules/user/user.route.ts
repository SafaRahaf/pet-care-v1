import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { ROLE } from "./user.constant";
const router = express.Router();

router.get("/me", auth(ROLE.admin, ROLE.user), userControllers.getProfileInfo);
router.put(
  "/me",
  auth(ROLE.admin, ROLE.user),
  userControllers.updateProfileInfo
);

router.get("/", auth(ROLE.admin), userControllers.getAllUsers);

router.put("/role/:userId", auth(ROLE.admin), userControllers.updateUserRole);

router.delete("/:userId", auth(ROLE.admin), userControllers.deleteUser);

router.post(
  "/follow/:userId",
  auth(ROLE.user, ROLE.admin),
  userControllers.followUser
);
router.post(
  "/unfollow/:userId",
  auth(ROLE.user, ROLE.admin),
  userControllers.unfollowUser
);

export const UserRoutes = router;
