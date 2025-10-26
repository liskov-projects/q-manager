"use client";
// hooks
import { useEffect, useState } from "react";
// components
import ToggleSwitch from "@/Components/Buttons/ToggleSwitch";
import { useFavourites } from "@/context/FavouriteItemsContext";
import { TUser } from "@/types/Types.js";
import { headers } from "next/headers.js";


export default function UserNotifications() {
  const {appUser} = useFavourites();
   
  const [notificationsOn, setNotificationsOn] = useState(appUser?.notificationPreference || false);
  
  const handleNotifications = async () => {
    if(appUser === null) return;
    try{
      console.log(appUser, "Matt was here");

      const response = await fetch(`/api/user/${appUser._id}/notification-change`, {method: "PUT", headers: {"Content-Type" : "application/json"}, body : JSON.stringify({notificationPreference: appUser.notificationPreference})});
      const data = await response.json();
      if (response.ok) {
        return data;
      }
      else {
        console.warn("Failed to Update Notification", data);
        return null;
      }
      
    } catch(err) {
        throw new Error("Error update in notification");
    }
  };

  useEffect(() => { 
    console.log(appUser, "Prags was here");
    if(notificationsOn === true) {
      appUser.notificationPreference = true;
    } else {
      appUser.notificationPreference = false;
    }
    handleNotifications(); 
  }, [notificationsOn]);


  return (
    <div>
      <ToggleSwitch isOn={notificationsOn} setIsOn={setNotificationsOn}>
        allow notifications here
      </ToggleSwitch>
    </div>
  );
}
