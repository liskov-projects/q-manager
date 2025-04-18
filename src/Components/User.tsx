"use client";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faInfoCircle, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

export default function User() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 w-full justify-end">
      {isSignedIn ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <Image
            src={user.imageUrl}
            alt="User Profile"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            width={48}
            height={48}
          />
          <Link
            href="/how-qm-works"
            className="p-1 sm:px-2 text-sm sm:text-base text-bluestone-200 border-2 border-bluestone-200 rounded hover:bg-bluestone-200 hover:text-shell-100"
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            {/* <FontAwesomeIcon icon={faQuestionCircle} /> */}
          </Link>
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
        <>
          <Link
            href="/how-qm-works"
            className="p-1 sm:px-2 text-sm sm:text-base text-bluestone-200 border-2 border-bluestone-200 rounded hover:bg-bluestone-200 hover:text-shell-100"
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            {/* <FontAwesomeIcon icon={faQuestionCircle} /> */}
          </Link>
          <Link
            href="/login"
            className="p-1 sm:px-2 text-sm sm:text-base text-bluestone-200 border-2 border-bluestone-200 rounded hover:bg-bluestone-200 hover:text-shell-100"
          >
            Sign In
          </Link>
        </>
      )}
    </div>
  );
}
