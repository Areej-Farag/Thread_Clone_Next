import UserCard from "@/components/cards/UserCard";
import { getUser, searchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SearchPage() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id || ""); // using Mongo ID

  if (!userInfo?.onboarded) {
    return redirect("/onboarding");
  }

  const results = await searchUsers({
    userId: user?.id || "",
    searchTerm: "",
    pageNumber: 1,
    pageSize: 25,
    sortBy: "desc",
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-col gap-9">
        {results.users.length === 0 ? (
          <p className="text-center text-light-2">No users found.</p>
        ) : (
          results.users.map((person) => (
            <UserCard
              key={person.id}
              name={person.name}
              username={person.username}
              image={person.image}
              id={person.id}
              personType="User"
            />
          ))
        )}
      </div>
    </section>
  );
}
