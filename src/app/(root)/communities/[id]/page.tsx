import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // moongo Id

  if (!id) notFound();

  const MyCurrentUser = await currentUser();
  const communityDetails = await fetchCommunityDetails(id);
  console.log("communityDetails", communityDetails);

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails?.id}
        authUserId={MyCurrentUser?.id || ""}
        name={communityDetails?.name}
        username={communityDetails?.username}
        bio={communityDetails?.bio}
        image={communityDetails?.image}
        type="Community"
      />
      <div className="mt-9 w-full">
        <Tabs defaultValue="threads" className="w-full flex-col">
          <TabsList className="tab w-full">
            {communityTabs.map((tab) => (
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
                    {communityDetails?.threads.length}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={"threads"} className="w-full text-light-1 mt-5">
            <ThreadsTab
              currentUser={MyCurrentUser?.id || ""}
              accountId={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>
          <TabsContent value={"members"} className="w-full text-light-1 mt-5">
            <section className="mt-9 flex flex-col gap-10">
              {communityDetails?.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  image={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
