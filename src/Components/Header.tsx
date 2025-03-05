"use client";
import User from "@/components/User";
// import Button from "./Buttons/Button";
import Link from "next/link";
import {usePathname} from "next/navigation";
import LiskovLogo from "@/Components/Svgs/LiskovLogo.tsx";

export default function Header() {
  const path = usePathname();

  const notHome = path !== "/all-tournaments";

  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center">
        <div className="w-20 flex-shrink-0">
          <LiskovLogo />
        </div>
        {notHome && (
          <Link
            href="/all-tournaments"
            className="self-center ml-2 text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] hover:bg-bluestone-200 hover:text-shell-100">
            Back to all tournaments
          </Link>
        )}
      </div>
      <h1 className="flex-grow text-2xl text-heading text-center">
        Queue Management
      </h1>
      <User />
    </div>
  );
}
