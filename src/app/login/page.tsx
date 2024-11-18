"use client";
import {useEffect} from "react";
import {SignInButton, SignedIn, SignedOut, UserButton, useUser} from "@clerk/nextjs";
// to redirect the user to a specific route after logginin
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const {isSignedIn} = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/"); // Redirect to home page after sign-in
    }
  }, [isSignedIn, router]);

  return (
    <div>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <span className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700">
            Click to Sign In
          </span>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
