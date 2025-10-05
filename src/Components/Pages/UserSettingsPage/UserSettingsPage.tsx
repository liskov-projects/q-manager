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
    // <div className="m-4 max-w-[1200px] mx-auto"> wrong width and wrong margin
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
      <div className="grid mt-20 items-start mx-auto  grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Left: Favourites */}

        <div className="flex flex-col w-[100%] mx-auto gap-4">
          {/* <SectionHeader>Manage Favourites</SectionHeader> that is doubled up see span element above */}
          {!hasFavourites ? (
            <div className="text-center">
              <img src="/snoopy_raining.gif" alt="no favourites" className="w-32 mx-auto" />
              <p className="text-gray-600 mt-2">No favourites yet — go add some!</p>
            </div>
          ) : (
            <Favourites />
          )}
        </div>
        <div className="grid mx-auto  grid-cols-1  md:grid-cols-[minmax(250px,350px)_minmax(250px,350px)] gap-6">
          {appUser ? (
            <>
              <div className="flex items-center flex-col ">
                <SectionHeader className="">Edit Your Info</SectionHeader>
                <div className="grid w-[100%] gap-4 ">
                  <UserData userData={appUser} />
                </div>
              </div>
              <div className="flex items-center flex-col ">
                <SectionHeader>Notification Preferences</SectionHeader>
                <div className="grid w-[100%]">
                  <UserNotifications />
                </div>
              </div>
            </>
          ) : (
            <span className="text-center text-gray-500">Getting user data...</span>
          )}
        </div>
        {/* Right: User Info and Notifications */}
        {/* <div className="flex flex-col items-center w-[100%] gap-6"> {appUser ? ( <> <div className="flex flex-col gap-4 w-[100%]"> <SectionHeader>Edit Your Info</SectionHeader> <UserData userData={appUser} /> </div> <div className="flex flex-col gap-4 w-[100%]"> <SectionHeader>Notification Preferences</SectionHeader> <UserNotifications /> </div> </> ) : ( <span className="text-center text-gray-500">Getting user data...</span> )} </div>  */}
        {/* tailwind is always mobile first approach grid-cols-1 is mobile, -->media queries--> sm 640px, md 768px,lg 1024px,xl 1280px, 2xl 1536px */}
        {/* <div className="grid  grid-cols-1 mx-auto  md:grid-cols-[minmax(250px,1fr)_minmax(250px,1fr)] gap-6">
          {appUser ? (
            <>
              <div className="flex items-start flex-col ">
                <SectionHeader className="">Edit Your Info</SectionHeader>
                <div className="grid w-[100%] gap-4 ">
                  <UserData userData={appUser} />
                </div>
              </div>
              <div className="flex items-start flex-col ">
                <SectionHeader>Notification Preferences</SectionHeader>
                <div className="grid w-[100%]">
                  <UserNotifications />
                </div>
              </div>
            </>
          ) : (
            <span className="text-center text-gray-500">Getting user data...</span>
          )}
        </div> */}
      </div>
    </div>
  );
}
