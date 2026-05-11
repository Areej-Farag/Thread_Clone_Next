"use client";

import { sidebarLinks } from "@/constants";
import { Show, SignOutButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LeftSideBar() {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <section className="leftsidebar custom-scrollbar">
      <div className="flex flex-1 w-full flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          if (link.label === "Profile") {
            link.route = `/profile/${userId}`;
          }
          return (
            <Link
              href={link.route}
              key={link.label}
              className={
                `leftsidebar_link` + (isActive ? " bg-primary-500" : "")
              }
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
      <Show when="signed-in">
        <SignOutButton redirectUrl="/sign-in">
          <div className="flex cursor-pointer justify-center gap-4 items-center">
            <Image
              src="/assets/logout.svg"
              alt="logout"
              width={24}
              height={24}
            />
            <p className="text-light-2 max-lg:hidden">LogOut</p>
          </div>
        </SignOutButton>
      </Show>
    </section>
  );
}
