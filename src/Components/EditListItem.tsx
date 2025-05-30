// hooks
import { useState } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { usePathname } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
// types
import { TPlayer } from "@/types/Types";
// components
import Button from "./Buttons/Button";

export default function EditListItem({
  item,
  setEditMode,
}: {
  item: TPlayer;
  setEditMode: (value: boolean) => void; //fixes: setEditMode(false) - Expected 0 arguments, but got 1.ts
}) {
  // console.log("inside the edit card ", item);
  const { currentTournament } = useTournamentsAndQueuesContext();
  const { socket } = useSocket();
  const [updatedData, setUpdatedData] = useState({
    names: item.names,
    categories: item.categories,
    phoneNumbers: item.phoneNumbers.join(", "),
  });

  // getting the tournament id
  const pathname = usePathname();
  const tournamentID = pathname.split("/").pop();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedCard = {
      ...item,
      tournamentID: tournamentID,
      names: updatedData.names,
      categories: updatedData.categories,
      phoneNumbers: updatedData.phoneNumbers.split(",").map((num: string) => num.trim()),
    };

    if (socket) {
      socket.emit("editPlayer", {
        tournamentId: currentTournament?._id,
        playerData: updatedCard,
      });
    }

    setEditMode(false);
  };
  return (
    <div className="flex flex-col ">
      <form
        onSubmit={handleSave}
        className="flex flex-col h-30 p-6 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2 bg-shell-75"
      >
        <Button
          className="flex ml-auto text-2xl font-bold hover:text-brick-200"
          onClick={() => setEditMode(false)}
        >
          X
        </Button>
        <label htmlFor="names">Name</label>
        <input
          className="w-full rounded focus:outline-none focus:ring-2 focus:ring-brick-200 py-1 px-2"
          type="text"
          name="names"
          id="names"
          value={updatedData.names}
          onChange={handleChange}
        />

        <label htmlFor="name">Categories</label>
        <input
          className="w-full rounded focus:outline-none focus:ring-2 focus:ring-brick-200 py-1 px-2"
          type="text"
          name="categories"
          id="categories"
          value={updatedData.categories}
          onChange={handleChange}
        />

        <label htmlFor="phoneNumbers">Phone Numbers</label>
        <input
          className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200 w-full py-1 px-2"
          type="text"
          name="phoneNumbers"
          id="phoneNumbers"
          value={updatedData.phoneNumbers}
          onChange={handleChange}
        />
        <Button
          type="submit"
          className="my-4 px-5 py-2 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center"
        >
          Save
        </Button>
      </form>
    </div>
  );
}
