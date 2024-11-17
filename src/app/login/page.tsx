import {SignInButton, SignedIn, SignedOut, UserButton} from "@clerk/nextjs";

export default function LoginPage() {
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
