import { getUserThreads } from "@/lib/actions/user.actions";
import React from "react";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

type ThreadsTabProps = {
  currentUser: string;
  accountId: string;
  accountType: "User" | "Community";
};

export default async function ThreadsTab({
  currentUser,
  accountId,
  accountType,
}: ThreadsTabProps) {
  let threads;
  if (accountType === "User") {
    threads = await getUserThreads(accountId);
  } else {
    threads = await fetchCommunityPosts(accountId);
  }

  if (!threads || threads.length === 0) {
    return (
      <section className="flex items-center justify-center h-48">
        <p className="text-light-2 text-base-regular">No threads to show</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-10 mt-9">
      {threads.threads.map((thread) => (
        <ThreadCard
          key={thread._id.toString()}
          id={thread._id.toString()}
          content={thread.text}
          author={
            accountType === "User"
              ? {
                  username: threads.username,
                  image: threads.image,
                  id: threads.id,
                }
              : {
                  username: thread.author.username,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          createdAt={thread.createdAt.toISOString()}
          parentId={thread.parentId ? thread.parentId.toString() : null}
          comments={thread.comments}
          currentUserId={currentUser}
        />
      ))}
    </section>
  );
}
