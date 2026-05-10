import PostThread from "@/components/forms/PostThread";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
const CreateThreadPage = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo = await getUser(user.id);
  if (!userInfo?.onboarded) {
    return redirect("/onboarding");
  }

  return (
    <main>
      <h1 className="head-text my-4">Create Thread</h1>
      <PostThread userId={userInfo._id.toString()} />
    </main>
  );
};

export default CreateThreadPage;
