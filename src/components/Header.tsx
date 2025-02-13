"use client";

import User from "@/components/User";
import Image from "next/image";
// import Button from "./Buttons/Button";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Header() {
  const path = usePathname();

  const pageTitle = path === '/all-tournaments' ? "All Tournaments" : "Tournament Queue Management"


  return (
    <div className="flex justify-between items-center h-20 py-2 bg-red-500">
      <div>
        <div className="flex-shrink-0 w-16 h-16 ml-8">
          <Image
            src="/liskov-logo.svg"
            alt="Logo"
            width={100}
            height={100}
          />
        </div>
      </div>
      <h1 className="flex-grow text-3xl text-heading text-center">
        {pageTitle}
      </h1>
      <User />
    </div>
  );
}
