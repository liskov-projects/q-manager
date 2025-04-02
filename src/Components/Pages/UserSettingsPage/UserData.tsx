"use client";
// hooks
import { useState, useEffect } from "react";
// types
import { TUser } from "@/types/Types";
//  components
import Button from "@/Components/Buttons/Button";
import ToggleSwitch from "@/Components/Buttons/ToggleSwitch";

export default function UserData({ userData }: { userData: TUser }) {
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const [updatedData, setUpdatedData] = useState<Partial<TUser>>({
    name: userData.userName,
    phoneNumber: userData.phoneNumber,
  });

  const { userName } = userData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prev: Partial<TUser>) => ({ ...prev, [name]: value }));
  };

  const handleUpdatedData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("did it update?", updatedData);
  };

  return (
    <>
      <div className="flex flex-row">
        <label>Edit {userName}&apos;s info</label>
        <ToggleSwitch canEdit={canEdit} setCanEdit={setCanEdit} />
      </div>
      <fieldset disabled={!canEdit}>
        <form className="flex flex-col" onSubmit={handleUpdatedData}>
          <label className="flex flex-row justify-around m-2">
            Name:
            <input type="text" value={updatedData.name} onChange={handleChange} name="name" />
          </label>
          <label className="flex flex-row justify-around m-2">
            Phone Number:
            <input
              type="text"
              value={updatedData.phoneNumber}
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
      </fieldset>
    </>
  );
}
