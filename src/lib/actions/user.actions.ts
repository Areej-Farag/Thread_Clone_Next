"use server";

import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import mongoose, { SortOrder, isValidObjectId } from "mongoose";

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: {
  userId: string | number;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}) {
  try {
    await connectToDB();

    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true,
        new: true,
      },
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }

    const plainUser = {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      bio: updatedUser.bio,
      image: updatedUser.image,
      onboarded: updatedUser.onboarded,
      _id: updatedUser._id.toString(),
      createdAt: updatedUser.createdAt?.toISOString(),
      updatedAt: updatedUser.updatedAt?.toISOString(),
    };

    return { success: true, user: plainUser };
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export const getUser = async (userId: string) => {
  try {
    connectToDB();
    const query = {
      $or: [{ id: userId }],
    };

    if (isValidObjectId(userId)) {
      query.$or.push({ _id: userId });
    }

    const user = await User.findOne(query);

    return user;
  } catch (error: any) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

export async function getUserThreads(userId: string) {
  try {
    connectToDB();
    // ToDO populate Community threads as well when we have community feature implemented
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: "Thread",
      populate: [
        {
          path: "community",
          model: "Community",
          select: "name id image _id",
        },

        {
          path: "children",
          model: "Thread",
          populate: {
            path: "author",
            model: "User",
            select: "name image id",
          },
        },
      ],
    });

    return threads || [];
  } catch (error: any) {
    throw new Error(`Failed to get user threads: ${error.message}`);
  }
}

export async function searchUsers({
  userId,
  searchTerm = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchTerm: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchTerm, "i");

    const query = {
      id: { $ne: userId },
    };

    if (searchTerm.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };
    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);
    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to search users: ${error.message}`);
  }
}

export const getActivities = async (userId: string) => {
  try {
    connectToDB();
    const userThreads = await Thread.find({ author: userId });

    const ChildThredsIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: ChildThredsIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: "User",
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to get activities: ${error.message}`);
  }
};
