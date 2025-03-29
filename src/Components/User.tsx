"use client";
// hooks
import { SignOutButton, useUser } from "@clerk/nextjs";
// components
import Link from "next/link";
import Image from "next/image";
import Button from "./Buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

export default function User() {
  const { isSignedIn, user } = useUser();
  return (
    <div className="flex items-center w-[20%]">
      {isSignedIn ? (
        <div className="flex flex-row items-center justify-around w-full">
          <Image
            src={user.imageUrl} // Clerk's profile image URL
            alt="User Profile"
            className="w-16 h-16 rounded-full object-cover" //Max rounding & proper sizing
            width={64} // Matches Tailwind w-16 (64px)
            height={64} // Matches Tailwind h-16 (64px)
          />
          <Link
            href="/all-tournaments/user-settings"
            className="text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] p-2 hover:bg-bluestone-200 hover:text-shell-100"
          >
            <FontAwesomeIcon icon={faCog} />
          </Link>
          <div className="text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] p-2 hover:bg-bluestone-200 hover:text-shell-100">
            <SignOutButton>Sign out</SignOutButton>
          </div>
        </div>
      ) : (
        <Link
          href="/login"
          className="text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] p-2 hover:bg-bluestone-200 hover:text-shell-100"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}
