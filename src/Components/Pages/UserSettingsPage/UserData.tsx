"use client";
// hooks
import { useState, useEffect } from "react";
// types
import { TUser } from "@/types/Types";
//  components
import Button from "@/Components/Buttons/Button";

export default function UserData({ userData }: { userData: TUser }) {
  const [updatedData, setUpdatedData] = useState<Partial<TUser>>({
    name: userData.name,
    phoneNumber: userData.phoneNumber,
  });

  // console.log("userData", userData);

  // extract the fields
  const { userName, phoneNumber } = userData;

  // needed when the data is changed
  useEffect(() => {
    setUpdatedData({
      name: userData.name,
      phoneNumber: userData.phoneNumber,
    });
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUpdatedData({
      ...updatedData,
      [name]: value,
    });
  };

  const handleUpdatedData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("did it update?", updatedData);
  };

  return (
    <form className="flex flex-col" onSubmit={handleUpdatedData}>
      <label className="flex flex-row justify-around m-2">
        Name:
        <input
          type="text"
          value={updatedData.name || userName || ""}
          onChange={handleChange}
          name="name"
        />
      </label>
      <label className="flex flex-row justify-around m-2">
        Phone Number:
        <input
          type="text"
          value={updatedData.phoneNumber || phoneNumber || ""}
          onChange={handleChange}
          name="phoneNumber"
        />
      </label>
      <Button
        type="submit"
        className="py-1 px-2 self-center ml-2 text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] hover:bg-bluestone-200 hover:text-shell-100"
      >
        Save changes
      </Button>
    </form>
  );
}
