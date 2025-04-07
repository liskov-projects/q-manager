"use client";
// hooks
import { usePathname, useRouter } from "next/navigation";
// components
import User from "@/Components/User";
import Link from "next/link";
import Button from "./Buttons/Button";
import TennisLogo from "./TennisLogo";

export default function Header() {
  const path = usePathname();
  const router = useRouter();

  const home = path == "/all-tournaments";
  const userSettingsPath = path === "/all-tournaments/user-settings";

  return (
    <header className="w-full flex flex-wrap items-center justify-between gap-4 p-4 sm:flex-nowrap sm:gap-0">
      {/* Buttons section */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/all-tournaments"
          className={`p-2 text-sm text-bluestone-200 border-2 border-bluestone-200 rounded ${home ? "" : "hover:bg-bluestone-200"}`}
          aria-disabled={home}
        >
          <TennisLogo className="w-[30px] h-[30px]" />
        </Link>

        {userSettingsPath && (
          <Button
            onClick={() => router.back()}
            className="py-1 px-2 text-sm text-bluestone-200 border-2 border-bluestone-200 rounded hover:bg-bluestone-200 hover:text-shell-100"
          >
            Back
          </Button>
        )}
      </div>

      {/* Center Title */}
      <h1 className="text-xl sm:text-2xl text-heading text-center sm:ml-[-4rem]">
        Queue Management
      </h1>

      {/* Right Section: User Info */}
      <div className="flex-shrink-0">
        <User />
      </div>
    </header>
  );
}
