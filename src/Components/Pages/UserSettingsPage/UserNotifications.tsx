"use client";
// hooks
import { useState } from "react";
// components
import ToggleSwitch from "@/Components/Buttons/ToggleSwitch";

export default function UserNotifications() {
  const [notificationsOn, setNotificationsOn] = useState(false);
  return (
    <div className="flex w-full">
      <ToggleSwitch  isOn={notificationsOn} setIsOn={setNotificationsOn}>
        <p className="p-1">Allow notifications </p>
      </ToggleSwitch>
    </div>
  );
}
