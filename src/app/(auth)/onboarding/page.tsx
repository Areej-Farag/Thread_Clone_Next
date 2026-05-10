import AccountProfile from "@/components/forms/AccountProfile";
import { User } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
export default async function onBoardingPage() {
  const clerkUser = await currentUser();
  const userInfo = {};

  const userData: User = {
    id: clerkUser?.id,
    objectId: userInfo?._id,
    username: userInfo?.username || clerkUser?.username,
    name: userInfo?.name || clerkUser?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || clerkUser?.imageUrl,
  };
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">OnBoarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}
