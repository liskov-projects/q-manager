// hooks
import { useState } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { usePathname } from "next/navigation";
// types
import { TPlayer } from "@/types/Types";
// components
import Button from "./Buttons/Button";

export default function EditListItem({
  item,
  setEditMode,
}: {
  item: TPlayer;
  setEditMode: () => void;
}) {
  console.log("inside the edit card ", item);
  const { setCurrentTournament } = useTournamentsAndQueuesContext();
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
      phoneNumbers: updatedData.phoneNumbers.split(",").map((num) => num.trim()),
    };

    try {
      const res = await fetch(`/api/players/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCard),
      });

      if (res.ok) {
        const updatedTournament = await res.json();
        // console.log("getting updated player correctly:", updatedTournament);

        // setPlayers(prev => [...prev, data]);
        setCurrentTournament(updatedTournament);
        // console.log(currentTournamentPlayers);

        setEditMode(false);
      }
    } catch (error) {
      console.error("Failed to update player:", error);
    }
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
          className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
          type="text"
          name="names"
          id="names"
          value={updatedData.names}
          onChange={handleChange}
        />

        <label htmlFor="name">Categories</label>
        <input
          className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
          type="text"
          name="categories"
          id="categories"
          value={updatedData.categories}
          onChange={handleChange}
        />

        <label htmlFor="phoneNumbers">Phone Numbers</label>
        <input
          className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
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
