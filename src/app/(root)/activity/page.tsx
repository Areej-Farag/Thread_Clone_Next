import { getActivities, getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ActivityPage() {
  const user = await currentUser();

  const userInfo = await getUser(user?.id || ""); // using Mongo ID

  if (!userInfo?.onboarded) {
    return redirect("/onboarding");
  }

  //get Notifications for the user and display them here

  const activity = await getActivities(userInfo._id);
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((item) => (
              <Link key={item._id} href={`/thread/${item.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={item.author.image}
                    alt={"profile picture"}
                    width={20}
                    height={20}
                    className="object-cover rounded-full"
                  />
                  <p className="!text-sm text-light-1 flex items-center gap-1">
                    <span className="font-medium text-primary-500 mr-1">
                      {item.author.name}
                    </span>{" "}
                    Replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <>
            <p className="!texr-base-regular text-light-3">
              No recent activity
            </p>
          </>
        )}
      </section>
    </section>
  );
}
