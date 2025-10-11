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
    <div className=" w-full mx-auto">
      {/* header section */}
      <Header> {appUser?.username}&rsquo;s Dashboard</Header>
      {/* <SectionHeader>
        <span className="truncate max-w-full text-2xl font-bold block mt-4"></span>
      </SectionHeader> */}
      <span className="text-center text-lg sm:text-xl font-medium block mb-4">
        Hello <span title={appUser?.username}>{appUser?.username}</span>, you can manage your
        favourites and settings here.
      </span>

      {/* grid layout that stacks on smaller screens */}
      <div className=" grid mt-10  gap-5 grid-cols-1 md:grid-cols-2 p-4">
        {/* Left: Favourites */}

        <div className="flex  w-[100%] ">
          {!hasFavourites ? (
            <div className="text-center">
              <img src="/snoopy_raining.gif" alt="no favourites" className="w-32 mx-auto" />
              <p className="text-gray-600 mt-2">No favourites yet — go add some!</p>
            </div>
          ) : (
            <Favourites />
          )}
        </div>
        <div className="flex  w-[100%] ">
          {appUser ? (
            <>
              <div className="flex w-full  flex-col ">
                <SectionHeader>Edit Your Info</SectionHeader>
                <div className="w-[100%] flex flex-col mb-1px ">
                  <UserData userData={appUser} />
                </div>

                <SectionHeader className="mt-4 ">Notification Preferences</SectionHeader>
                <div className="flex flex-col w-[100%] ">
                  <UserNotifications />
                </div>
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
