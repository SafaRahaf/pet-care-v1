import { TUser } from "./user.interface";
import { User } from "./user.model";

const getProfile = async (userId: string) => {
  const userProfile = await User.findById(userId);

  if (userProfile) {
    return userProfile;
  } else {
    throw new Error("User profile not found");
  }
};

const createAdminIntoDB = async (payload: TUser) => {
  const admin = await User.create(payload);
  return admin;
};

const updateProfile = async (userId: string, updateData: any) => {
  const updateProfile = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  if (updateProfile) {
    return updateProfile;
  } else {
    throw new Error("User profile not found");
  }
};

const updateRole = async (userId: string, role: string) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );

  if (updatedUser) {
    return updatedUser;
  } else {
    throw new Error("User not found");
  }
};

const getAllUsertIntoDB = async () => {
  const users = await User.find();
  return users;
};

const deleteUserFromDB = async (userId: string) => {
  const deletedUser = await User.findByIdAndDelete(userId);

  if (deletedUser) {
    return deletedUser;
  } else {
    throw new Error("User not found");
  }
};

const followUser = async (userId: string, followUserId: string) => {
  if (userId === followUserId) {
    throw new Error("You cannot follow yourself");
  }

  const user = await User.findById(userId);
  const followUser = await User.findById(followUserId);

  if (!user || !followUser) {
    throw new Error("User not found");
  }

  // @ts-ignore
  user.following = user.following || [];
  // @ts-ignore
  followUser.followers = followUser.followers || [];

  // @ts-ignore
  if (user.following?.includes(followUserId)) {
    throw new Error("You are already following this user");
  }

  // @ts-ignore
  user.following!.push(followUserId);
  // @ts-ignore
  followUser.followers?.push(userId);
  await Promise.all([user.save(), followUser.save()]);

  return { success: true, message: "Followed successfully" };
};

const unfollowUser = async (userId: string, unfollowUserId: string) => {
  if (userId === unfollowUserId) {
    throw new Error("You cannot unfollow yourself");
  }

  const user = await User.findById(userId);
  const unfollowUser = await User.findById(unfollowUserId);

  if (!user || !unfollowUser) {
    throw new Error("User not found");
  }
  // @ts-ignore
  user.following = user.following || [];
  // @ts-ignore
  unfollowUser.followers = unfollowUser.followers || [];

  // @ts-ignore
  if (!user.following?.includes(unfollowUserId)) {
    throw new Error("You are not following this user");
  }

  // @ts-ignore
  user.following = user.following?.filter((id) => id !== unfollowUserId);
  // @ts-ignore
  unfollowUser.followers = unfollowUser.followers?.filter(
    (id: string) => id !== userId
  );
  await Promise.all([user.save(), unfollowUser.save()]);

  return { success: true, message: "Unfollowed successfully" };
};

export const UserServices = {
  getProfile,
  updateProfile,
  createAdminIntoDB,
  updateRole,
  getAllUsertIntoDB,
  deleteUserFromDB,
  followUser,
  unfollowUser,
};
