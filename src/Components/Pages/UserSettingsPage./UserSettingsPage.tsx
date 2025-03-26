import { currentUser } from "@clerk/nextjs/server";
import Favourites from "./Favourites";

export default async function UserSettingsPage() {
  const user = await currentUser();

  if (!user) return <div>Not signed in</div>;

  const username = user?.firstName;
  return (
    <div>
      <h1>Hello {username}</h1>
      <h2>Manage Favourites</h2>
      <span>{username}'s Favourites</span>
      <Favourites />
      <h2>Manage Notifications</h2>
    </div>
  );
}
