"use client";
// hooks
import { useEffect, useState } from "react";
// components
import ToggleSwitch from "@/Components/Buttons/ToggleSwitch";
import { useFavourites } from "@/context/FavouriteItemsContext";
import { TUser } from "@/types/Types.js";
import { headers } from "next/headers.js";


export default function UserNotifications() {
  const {appUser, setAppUser} = useFavourites();

  const [notificationsOn, setNotificationsOn] = useState(appUser?.notificationPreference || false);

  const handleNotifications = async (appUser:TUser) => {
    if(appUser === null) return;
    try{
      const response = await fetch("/api/user", {method: "POST", headers: {"Content-Type" : "application/json"}, body : JSON.stringify({appUser})});
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
    if(notificationsOn === true) {
      setAppUser((prev:TUser) => ({
        ...prev, 
        notificationPreference: true,
      }));
    } else {
      setAppUser((prev:TUser) => ({
        ...prev, 
        notificationPreference: false,
      }));
    }
    handleNotifications(appUser);
  }, [notificationsOn]);

  /*
  const [notificationsOn, setNotificationsOn] = useState(
    localStorage.getItem("notifs-on") || false
  );

  useEffect(() => {
    localStorage.setItem("notifs-on", String(notificationsOn));
  }, [notificationsOn]);
  */

  return (
    <div>
      <ToggleSwitch isOn={notificationsOn} setIsOn={setNotificationsOn}>
        allow notifications here
      </ToggleSwitch>
    </div>
  );
}
