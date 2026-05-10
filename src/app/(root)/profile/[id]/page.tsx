import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // moongo Id

  if (!id) notFound();

  const MyCurrentUser = await currentUser();

  const userInfo = await getUser(id); // using Mongo ID

  if (!userInfo?.onboarded) {
    if (MyCurrentUser?.id === id) {
      return redirect("/onboarding");
    }
  }

  return (
    <section>
      <ProfileHeader
        accountId={userInfo?.id}
        authUserId={MyCurrentUser?.id || ""}
        name={userInfo?.name}
        username={userInfo?.username}
        bio={userInfo?.bio}
        image={userInfo?.image}
      />
      <div className="mt-9 w-full">
        <Tabs defaultValue="threads" className="w-full flex-col">
          <TabsList className="tab w-full">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm-hidden ">{tab.label}</p>
                {tab.label === "Threads" && (
                  <span className="ml-1 rounded-full bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads.length}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-light-1 mt-5"
            >
              <ThreadsTab
                currentUser={MyCurrentUser?.id || ""}
                accountId={userInfo.id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
