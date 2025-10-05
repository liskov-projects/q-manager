"use client";
// hooks
import { useState } from "react";
// components
import ToggleSwitch from "@/Components/Buttons/ToggleSwitch";

export default function UserNotifications() {
  const [notificationsOn, setNotificationsOn] = useState(false);
  return (
    <div>
      <ToggleSwitch isOn={notificationsOn} setIsOn={setNotificationsOn}>
        allow notifications 
      </ToggleSwitch>
    </div>
  );
}
