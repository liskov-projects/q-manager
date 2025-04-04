"use client";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function User() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
      {isSignedIn ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <Image
            src={user.imageUrl}
            alt="User Profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            width={48}
            height={48}
          />
          <Link
            href="/all-tournaments/user-settings"
            className="p-1 sm:px-2 text-sm sm:text-base text-bluestone-200 border-2 border-bluestone-200 rounded hover:bg-bluestone-200 hover:text-shell-100"
            title="Settings"
          >
            <FontAwesomeIcon icon={faStar} />
          </Link>
          <div className="p-1 sm:px-2 text-sm sm:text-base text-bluestone-200 border-2 border-bluestone-200 rounded hover:bg-bluestone-200 hover:text-shell-100">
            <SignOutButton>Sign out</SignOutButton>
          </div>
        </div>
      ) : (
        <Link
          href="/login"
          className="p-1 sm:px-2 text-sm sm:text-base text-bluestone-200 border-2 border-bluestone-200 rounded hover:bg-bluestone-200 hover:text-shell-100"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}
