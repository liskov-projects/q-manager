"use client";
// hooks
import { useFavourites } from "@/context/FavouriteItemsContext";
import { useUser } from "@clerk/nextjs";
// components
import Favourites from "./Favourites";
import SectionHeader from "@/Components/SectionHeader";
import UserData from "./UserData";
import UserNotifications from "./UserNotifications";

export default function UserSettingsPage() {
  const { isSignedIn } = useUser();
  const { appUser } = useFavourites();

  // console.log("APP USER IN USER SETTINGS PAGE", appUser);

  if (!isSignedIn) return <div>Not signed in</div>;

  return (
    // page container
    <div className="m-4">
      {/* header section */}
      <SectionHeader>{`${appUser?.userName}\'s Dashboard`}</SectionHeader>
      <span className="text-center">
        Hello {appUser?.userName} You can manage your favourites here
      </span>
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="flex flex-col gap-2">
          <SectionHeader>Manage Favourites</SectionHeader>
          <Favourites />
        </div>
        {/* content section */}
        <div className="flex flex-col gap-2">
          <SectionHeader>Manage Notifications</SectionHeader>
          {appUser ? (
            <div>
              <UserData userData={appUser} />
              <UserNotifications />
            </div>
          ) : (
            <span>getting data</span>
          )}
        </div>
      </div>
    </div>
  );
}
