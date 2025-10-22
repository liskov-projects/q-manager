"use client";
// hooks
import { useState } from "react";
// types
import { TUser } from "@/types/Types";
//  components
import Button from "@/Components/Buttons/Button";
import ToggleSwitch from "@/Components/Buttons/ToggleSwitch";

export default function UserData({ userData }: { userData: TUser }) {
  const [updatedNotification, setUpdatedNotification] = useState<Boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  console.log(`initial notification ${updatedNotification}`);
  const [updatedData, setUpdatedData] = useState<Partial<TUser>>({
    name: userData.username,
    phoneNumber: userData.phoneNumber,
  });

  const { username } = userData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === "phoneNumber") {
      value = value.replace(/[^0-9+\s()-]/g, "");
    }
    setUpdatedData((prev: Partial<TUser>) => ({ ...prev, [name]: value }));
    setUpdatedNotification((prev) => prev != prev);
  };

  const handleUpdatedData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedUser = {
      ...updatedData,
      userNotification: updatedNotification,
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
    console.log(`initial notification ${updatedNotification}`);
  };

  return (
    <>
      <ToggleSwitch isOn={canEdit} setIsOn={setCanEdit}>
        <p className="p-1">Edit {username}&apos;s info</p>
      </ToggleSwitch>
      <fieldset disabled={!canEdit}>
        <form className="flex w-full flex-col" onSubmit={handleUpdatedData}>
          <label className="h-30 w-[100%] p-2 pl-2 mt-1 bg-shell-75 text-bluestone-200 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center">
            Name:
            <input
              type="text"
              value={updatedData.name}
              onChange={handleChange}
              name="name"
              className="rounded pl-2 flex "
              style={{ width: `${updatedData.name ? updatedData.name.length + 2 : +10}ch` }}
            />
          </label>
          <label className="h-30 w-[100%] p-2 pl-2 bg-shell-75 text-bluestone-200 rounded-lg shadow-left-bottom-lg flex flex-row gap-20 justify-between items-center my-2 ">
            Phone Number:
            <input
              type="tel"
              value={updatedData.phoneNumber}
              onChange={handleChange}
              name="phoneNumber"
              className="rounded pl-2"
              style={{
                width: `${updatedData.phoneNumber ? updatedData.phoneNumber.length + 2 : +10}ch`,
              }}
            />
          </label>

          {canEdit && (
            <Button
              type="submit"
              className="py-1 px-2 self-center mt-5 text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] hover:bg-bluestone-200 hover:text-shell-100  "
            >
              Save changes
            </Button>
          )}
        </form>
      </fieldset>
    </>
  );
}
