"use server";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
interface ThreadData {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export const createThread = async (threadData: ThreadData) => {
  try {
    await connectToDB();
    const createdThread = await Thread.create({
      text: threadData.text,
      author: threadData.author,
      community: threadData.communityId ? threadData.communityId : null,
    });

    await User.findByIdAndUpdate(threadData.author, {
      $push: { threads: createdThread._id },
    });

    console.log("Thread created successfully:", createdThread);
    revalidatePath(threadData.path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
};

export const getAllThreads = async (pageNumber = 1, pageSize = 20) => {
  try {
    await connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;

    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate({ path: "author", model: "User" })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: "User",
          select: "username image _id parentId",
        },
      });

    const totalPostCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const posts = await postsQuery.exec();
    const isNextPage = skipAmount + posts.length < totalPostCount;

    return { posts, totalPostCount, isNextPage };
  } catch (error: any) {
    throw new Error(`Failed to get threads: ${error.message}`);
  }
};

export const getSingleThread = async (threadId: string) => {
  try {
    await connectToDB();
    //community population can be added later if needed
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: "User",
        select: "_id id name image username",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: "User",
            select: "_id id name parentId image username",
          },
          {
            path: "children",
            model: "Thread",
            populate: {
              path: "author",
              model: "User",
              select: "_id id name parentId image username",
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Failed to get thread: ${error.message}`);
  }
};

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}) {
  connectToDB();
  try {
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Original thread not found");
    }
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });
    const savedComment = await commentThread.save();

    originalThread.children.push(savedComment._id);
    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }
}
