"use client";
import { ReactNode } from "react";
// hooks
import { usePathname, useRouter } from "next/navigation";
// components
import User from "@/Components/User";
import Link from "next/link";
import Button from "./Buttons/Button";
import TennisLogo from "./TennisLogo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaInfo, FaInfoCircle } from "react-icons/fa";
import {
  faInfo,
  faInfoCircle,
  faQuestion,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function Header({ children, className }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  const home = path == "/all-tournaments";
  // const userSettingsPath = path === "/all-tournaments/user-settings";

  return (
    <header className={`w-full flex items-center justify-between px-4 py-2`}>
      {/* Left Wing */}
      <div className="flex items-center gap-2 w-[30%] min-w-[100px]">
        <Link
          href="/all-tournaments"
          className={`p-2 text-sm text-bluestone-200 border-2 border-bluestone-200 rounded ${home ? "" : "hover:bg-bluestone-200"}`}
          aria-disabled={home}
          title="Home"
        >
          <TennisLogo className="w-[30px] h-[30px]" />
        </Link>

        {/* {userSettingsPath && (
          <Button
            onClick={() => router.back()}
            className="py-1 px-2 text-sm text-bluestone-200 border-2 border-bluestone-200 rounded hover:bg-bluestone-200 hover:text-shell-100"
          >
            Back
          </Button>
        )} */}
      </div>

      {/* Center Title */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-center p-1 font-bold text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-bluestone-200 truncate">
          {children}
        </h1>
      </div>

      {/* Right Wing */}
      <div className="flex items-center justify-end w-[30%] min-w-[100px]">
        <User />
      </div>
    </header>
  );
}
