"use client";
import { useEffect, useRef } from "react";
import {
  useClerk,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

// to redirect the user to a specific route after logginin
import { useRouter } from "next/navigation";
import { useFavourites } from "@/context/FavouriteItemsContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const { addUser } = useFavourites();

  const { openSignIn } = useClerk();
  const opened = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (opened.current) return;
    if (isSignedIn) return;
    {
      opened.current = true;

      openSignIn({
        afterSignInUrl: "/",
        afterSignUpUrl: "/",

        appearance: {
          elements: {
            modalBackdrop: "z-[60] bg-black/60 backdrop-blur-sm",
            modalContent: "z-[80] rounded-2xl shadow-2xl",
          },
        },
      });
    }
  }, [openSignIn]);

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
    <div className="flex flex-col h-full justify-center items-center bg-shell75 bg-opacity-60 backdrop-blur-sm ">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl border border-cyan-400 bg-bluestone-200 backdrop-blur-md shadow-2xl max-w-md w-full transition-all duration-300 hover:border-cyan-300 hover:shadow-cyan-200/30">
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton
              mode="modal"
              className="flex items-center justify-center cursor-pointer bg-tennis-200 text-bluestone-300 px-6 py-3 rounded-lg shadow-lg hover:bg-tennis-100 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Sign In
            </SignInButton>
          </SignedOut>
        </div>
        <Link
          href="/"
          className=" mx-auto w-max
                   px-4 py-2 text-sm font-medium text-white/90
                   bg-black/60 rounded-full backdrop-blur-md hover:text-white"
        >
          Continue as a Guest
        </Link>
      </div>
    </div>
  );
}
