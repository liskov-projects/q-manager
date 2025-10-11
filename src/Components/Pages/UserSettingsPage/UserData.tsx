"use client";
// hooks
import { useState } from "react";
// types
import { TUser } from "@/types/Types";
//  components
import Button from "@/Components/Buttons/Button";
import ToggleSwitch from "@/Components/Buttons/ToggleSwitch";

export default function UserData({ userData }: { userData: TUser }) {
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [updatedData, setUpdatedData] = useState<Partial<TUser>>({
    name: userData.username,
    phoneNumber: userData.phoneNumber,
  });

  const { username } = userData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prev: Partial<TUser>) => ({ ...prev, [name]: value }));
  };

  const handleUpdatedData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedUser = {
      ...updatedData,

      username: updatedData.name,
      phoneNumber: updatedData.phoneNumber,
    };

    try {
      const res = await fetch(`/api/user/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Added: ", data);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error changing data: ", err.message);
        // setErrorMessage("Error adding tournament");
      } else {
        console.error("Unknown error: ", err);
      }
    }

    setCanEdit(false);
  };

  return (
    <>
      <ToggleSwitch isOn={canEdit} setIsOn={setCanEdit}>
        <p className="p-1" >Edit {username}&apos;s info</p>
      </ToggleSwitch>
      <fieldset disabled={!canEdit}>
        <form className="flex flex-col" onSubmit={handleUpdatedData}>
          <label className="h-30 w-[100%] p-2 pl-2 bg-shell-75 text-bluestone-200 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center">
            Name:
            <input
              type="text"
              value={updatedData.name}
              onChange={handleChange}
              name="name"
              className="rounded pl-2"
            />
          </label>
          <label className="h-30 w-[100%] p-2 pl-2 bg-shell-75 text-bluestone-200 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2 ">
            Phone Number:
            <input
              type="text"
              value={updatedData.phoneNumber}
              onChange={handleChange}
              name="phoneNumber"
              className="rounded pl-2"
            />
          </label>
          {canEdit && (
            <Button
              type="submit"
              className="py-1 px-2 self-center ml-2 text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] hover:bg-bluestone-200 hover:text-shell-100  "
            >
              Save changes
            </Button>
          )}
        </form>
      </fieldset>
    </>
  );
}
