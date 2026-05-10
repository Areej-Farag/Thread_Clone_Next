import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  OrganizationSwitcher,
  Show,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
export default function TobBar() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center  gap-1">
        <div className="block md:hidden">
          <Show when="signed-in">
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                  className="flex cursor-pointer"
                />
              </div>
            </SignOutButton>
          </Show>
        </div>
        <UserButton />
        <OrganizationSwitcher
          appearance={{
            baseTheme: "dark",

            elements: {
              organizationSwitcherTrigger:
                "py-2 px-4 text-light-1 hover:text-primary-500",
            },
          }}
        />
      </div>
    </nav>
  );
}
