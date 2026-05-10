import ThreadCard from "@/components/cards/ThreadCard";
import { getAllThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const threads = await getAllThreads(1, 30);
  const user = await currentUser();
  return (
    <main>
      <h1 className="head-text text-left">Home</h1>
      <section className="flex flex-col mt-9 gap-10">
        {threads.posts.length > 0 ? (
          threads.posts.map((post) => (
            <ThreadCard
              key={post._id.toString()}
              id={post._id.toString()}
              content={post.text}
              author={{
                id: post.author._id.toString(),
                username: post.author.username,
                image: post.author.image,
              }}
              createdAt={post.createdAt.toISOString()}
              parentId={post.parentId ? post.parentId.toString() : null}
              comments={post.comments}
              currentUserId={user?.id.toString() || ""}
            />
          ))
        ) : (
          <p>No threads available.</p>
        )}
      </section>
    </main>
  );
}
