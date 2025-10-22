"use client";
// hooks
import { useState } from "react";
//types
import { TUser } from "@/types/Types";
// components
import ToggleSwitch from "@/Components/Buttons/ToggleSwitch";

export default function UserNotifications({userData}:{userData:TUser}) {
  const [updatedNotification, setUpdatedNotification] = useState<boolean>(false);
  const[updatedData,setUpdatedData]=useState<Partial<TUser>>({
    notification: userData.userNotification,
  })


  const {userNotification}=userData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUpdatedData((prev: Partial<TUser>) => ({ ...prev, [name]: checked }));
    setUpdatedNotification((prev) => prev != prev);
    console.log(`initial notification ${updatedNotification}`);
  };

  const handleUpdateData = async (e:React.FormEvent<HTMLFormElement>)=>{
    setUpdatedNotification(checked)
  }


  return (
    <div>
      <ToggleSwitch
        isOn={updatedNotification}
        setIsOn={setUpdatedNotification}
        name="userNotification"
        onChange={handleChange}
        onClick={handleUpdateData}
      >
        allow notifications here
      </ToggleSwitch>
    </div>
  );
}
