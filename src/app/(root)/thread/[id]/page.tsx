import ThreadCard from "@/components/cards/ThreadCard";
import { getSingleThread } from "@/lib/actions/thread.actions";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";
export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await currentUser();
  if (!id) {
    notFound();
  }
  const userInfo = await getUser(user?.id.toString() || "");
  if (!userInfo?.onboarded && !user) {
    redirect("/onboarding");
  }
  const thread = await getSingleThread(id);
  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id.toString()}
          content={thread.text}
          author={{
            id: thread.author._id.toString(),
            username: thread.author.username,
            image: thread.author.image,
          }}
          createdAt={thread.createdAt.toISOString()}
          parentId={thread.parentId ? thread.parentId.toString() : null}
          comments={thread.comments}
          currentUserId={user?.id.toString() || ""}
        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={JSON.stringify(thread._id)}
          userImage={userInfo.image || user?.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className="mt-10 flex flex-col gap-3">
        <h2 className="text-heading4-medium my-3 text-light-1">Comments</h2>
        {thread.children.length === 0 ? (
          <p className="mt-2 text-body-medium text-light-1">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          thread.children.map((comment) => (
            <ThreadCard
              key={comment._id.toString()}
              id={comment._id.toString()}
              content={comment.text}
              author={{
                id: comment.author._id.toString(),
                username: comment.author.username,
                image: comment.author.image,
              }}
              createdAt={comment.createdAt.toISOString()}
              parentId={comment.parentId ? comment.parentId.toString() : null}
              comments={comment.comments}
              isComment={true}
              currentUserId={user?.id.toString() || ""}
            />
          ))
        )}
      </div>
    </section>
  );
}
