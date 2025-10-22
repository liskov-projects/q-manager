"use client";
// hooks
import { useState, useEffect } from "react";
//types
import { TUser } from "@/types/Types";
// components
import ToggleSwitch from "@/Components/Buttons/ToggleSwitch";

export default function UserNotifications({ userData }: { userData: TUser }) {
  //source of truth
  const [updatedNotification, setUpdatedNotification] = useState<boolean>(
    userData.userNotification
  );

  //might be payload
  const [updatedData, setUpdatedData] = useState<Partial<TUser>>({
    userNotification: userData.userNotification,
  });

  useEffect(() => {
    setUpdatedData((prev) => ({ ...prev, userNotification: updatedNotification }));
  }, [updatedNotification]);

  const handleUpdateData = async () => {
    try {
      const res = await fetch(`/api/user/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("NotificationsStatus", data);
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
        setIsOn={setUpdatedNotification}
        onClick={handleUpdateData}
      >
        allow notifications here
      </ToggleSwitch>
    </div>
  );
}
