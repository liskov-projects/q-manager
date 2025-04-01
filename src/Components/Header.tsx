"use client";
// hooks
import { usePathname, useRouter } from "next/navigation";
// components
import User from "@/Components/User";
import Link from "next/link";
import LiskovLogo from "@/Components/Svgs/LiskovLogo.tsx";
import Button from "./Buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faTableCells } from "@fortawesome/free-solid-svg-icons";
export default function Header() {
  const path = usePathname();
  const router = useRouter();

  const notHome = path !== "/all-tournaments";
  const userSettingsPath = path === "/all-tournaments/user-settings";

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center justify-around w-[20%]">
        <div className="w-20 flex-shrink-0">
          <LiskovLogo />
        </div>
        {notHome && (
          <Link
            href="/all-tournaments"
            className="py-1 px-2 self-center ml-2 text-l text-brick-200 border-2 border-brick-200 rounded-[5px] hover:bg-brick-200 hover:text-shell-100"
          >
            {/* Back to all tournaments */}
            {/* <FontAwesomeIcon icon={faTable} /> */}
            <FontAwesomeIcon icon={faTableCells} />
          </Link>
        )}
        {userSettingsPath && (
          <Button
            onClick={() => router.back()}
            className="py-1 px-2 self-center ml-2 text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] hover:bg-bluestone-200 hover:text-shell-100"
          >
            Back
          </Button>
        )}
      </div>
      <h1 className="flex-grow text-2xl text-heading text-center">Queue Management</h1>
      <User />
    </div>
  );
}
