"use client";
// hooks
import { useFavourites } from "@/context/FavouriteItemsContext";
import { useUser } from "@clerk/nextjs";
// components
import Header from "@/Components/Header";
import Favourites from "./Favourites";
import SectionHeader from "@/Components/SectionHeader";
import UserData from "./UserData";
import UserNotifications from "./UserNotifications";

export default function UserSettingsPage() {
  const { isSignedIn } = useUser();
  const { appUser, favouritePlayers, favouriteTournaments } = useFavourites();

  if (!isSignedIn) return <div className="text-center text-lg mt-8">Not signed in</div>;

  const hasFavourites = favouritePlayers?.length > 0 || favouriteTournaments?.length > 0;

  return (
    <div className="m-4 max-w-[1200px] mx-auto">
      {/* header section */}
      <Header> {appUser?.userName}&rsquo;s Dashboard</Header>
      {/* <SectionHeader>
        <span className="truncate max-w-full text-2xl font-bold block mt-4"></span>
      </SectionHeader> */}
      <span className="text-center text-lg sm:text-xl font-medium block mb-4 mt-4">
        Hello <span title={appUser?.userName}>{appUser?.userName}</span>, you can manage your
        favourites and settings here.
      </span>

      {/* grid layout that stacks on smaller screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Left: Favourites */}
        <div className="flex flex-col gap-4">
          <SectionHeader>Manage Favourites</SectionHeader>
          {!hasFavourites ? (
            <div className="text-center">
              <img src="/snoopy-tennis-funny.gif" alt="no favourites" className="w-32 mx-auto" />
              <p className="text-gray-600 mt-2">No favourites yet — go add some!</p>
            </div>
          ) : (
            <Favourites />
          )}
        </div>

        {/* Right: User Info and Notifications */}
        <div className="flex flex-col gap-6">
          {appUser ? (
            <>
              <div className="flex flex-col gap-4">
                <SectionHeader>Edit Your Info</SectionHeader>
                <UserData userData={appUser} />
              </div>
              <div className="flex flex-col gap-4">
                <SectionHeader>Notification Preferences</SectionHeader>
                <UserNotifications />
              </div>
            </>
          ) : (
            <span className="text-center text-gray-500">Getting user data...</span>
          )}
        </div>
      </div>
    </div>
  );
}
