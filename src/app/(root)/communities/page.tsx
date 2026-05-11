import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CommunitiesPage() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id || ""); // using Mongo ID

  if (!userInfo?.onboarded) {
    return redirect("/onboarding");
  }

  const results = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
    sortBy: "desc",
  });

  return (
    <section>
      <h1 className="head-text mb-10">Communities</h1>

      <div className="mt-14 flex flex-col gap-9">
        {results.communities.length === 0 ? (
          <p className="text-center text-light-2">No users found.</p>
        ) : (
          results.communities.map((community) => (
            <CommunityCard
              key={community.id}
              name={community.name}
              username={community.username}
              imgUrl={community.image}
              id={community._id}
              bio={community.bio}
              members={community.members}
            />
          ))
        )}
      </div>
    </section>
  );
}
