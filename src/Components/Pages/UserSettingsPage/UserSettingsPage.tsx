// server-related
import { UserModel } from "@/models/UserModel";
import dbConnect from "@/lib/db";
// hooks
import { currentUser } from "@clerk/nextjs/server";
// components
import Favourites from "./Favourites";
import SectionHeader from "@/Components/SectionHeader";
import UserData from "./UserData";

export default async function UserSettingsPage() {
  const user = await currentUser();

  if (!user) return <div>Not signed in</div>;

  // server component - can do this here
  const userData = await UserModel.findById(user?.id).lean();

  const username = user?.firstName;
  // console.log("userData", userData);
  return (
    // page container
    <div className="m-4">
      {/* header section */}
      <SectionHeader>{`${username}\'s Dashboard`}</SectionHeader>
      <span className="text-center">Hello {username} You can manage your favourites here</span>
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="flex flex-col gap-2">
          <SectionHeader>Manage Favourites</SectionHeader>
          <Favourites />
        </div>
        {/* content section */}
        <div className="flex flex-col gap-2">
          <SectionHeader>Manage Notifications</SectionHeader>
          <span>notification features will be here with a radio button to enable them</span>
          <UserData userData={userData} />
        </div>
      </div>
    </div>
  );
}
