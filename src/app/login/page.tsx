"use client";

import { useEffect } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
// to redirect the user to a specific route after logginin
import { useRouter } from "next/navigation";
import { useFavourites } from "@/context/FavouriteItemsContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { getAppUserFromDB, setAppUser, appUser, addUser } = useFavourites();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/"); // Redirect to home page after sign-in
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    // only adds the user when we're signed in
    addUser(user?.id);
  }, [isSignedIn, user]);

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center p-8 rounded-lg shadow-lg max-w-md w-full">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <h2 className="text-3xl font-bold text-center text-bluestone-300 mb-6">Sign In</h2>
          <div className="flex items-center justify-center cursor-pointer bg-tennis-200 text-bluestone-300 px-6 py-3 rounded-lg shadow-lg hover:bg-tennis-100 transition duration-300 ease-in-out transform hover:scale-105">
            <SignInButton>Click to Sign In</SignInButton>
          </div>
        </SignedOut>
        <Link
          href="/"
          className="flex my-6 text-bluestone-300 no-underline hover:text-bluestone-100 hover:underline"
        >
          Continue as a Guest
        </Link>
      </div>
    </div>
  );
}
