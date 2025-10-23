"use client";
// hooks
import { useState } from "react";
//types
import { TUser } from "@/types/Types";
// components
import ToggleSwitch from "@/Components/Buttons/ToggleSwitch";
import { useFavourites } from "@/context/FavouriteItemsContext";

export default function UserNotifications({ userData }: { userData: TUser }) {
  const { setAppUser } = useFavourites();
  //source of truth
  const [updatedNotification, setUpdatedNotification] = useState<boolean>(
    userData.userNotification
  );

  const handleUpdateData = async (nextValue: boolean) => {
    try {
      const res = await fetch(`/api/user/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userNotification: nextValue }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("NotificationsStatus", data);
        setAppUser((prev) => (prev ? { ...prev, userNotification: nextValue } : prev));
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error changing data: ", err.message);
      } else {
        console.error("Unknown error: ", err);
      }
    }
  };

  return (
    <div>
      <ToggleSwitch
        isOn={updatedNotification}
        setIsOn={(next: boolean) => {
          console.log(next);
          setUpdatedNotification(next);
          void handleUpdateData(next);
        }}
      >
        allow notifications here
      </ToggleSwitch>
    </div>
  );
}
