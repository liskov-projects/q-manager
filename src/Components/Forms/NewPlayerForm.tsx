"use client";

import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import {useEffect, useState} from "react";
import {useUser} from "@clerk/nextjs";
// components
import Button from "../Buttons/Button";
import {TPlayer} from "@/types/Types";
import SectionHeader from "../SectionHeader";
import {useSocket} from "@/context/SocketContext";
// import TTournament from "@/types/Tournament";
// NEW: pills work
import TagsList from "../TagsList";
import TournamentCategories from "../Tournaments/TournamentCategories";

export default function NewPlayerForm() {
  // just check if logged in as the dropdown list is restricted to only the tournaments created by the logged in user
  const {isSignedIn} = useUser();
  const {currentTournament, setCurrentTournament, filteredTournaments} =
    useTournamentsAndQueuesContext();
  const {socket} = useSocket();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [newPlayers, setNewPlayers] = useState<TPlayer>({
    names: "",
    categories: "",
    phoneNumbers: ""
    // tournamentId: currentTournament?._id,
  });

  // console.log("within the form ", currentTournament);
  // console.log("tournamentID: ", currentTournament?._id);

  // NEW:
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCategories(currentTournament?.categories || []);
  }, [currentTournament?.categories]);

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  }

  function removeCategory(categoryToRemove: string) {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryToRemove));
  }
  //

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) {
    setNewPlayers({...newPlayers, [e.target.name]: e.target.value});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("New player data: ", newPlayers);

    // const incomingCategories =
    //   typeof newPlayers.categories === "string"
    //     ? newPlayers.categories.split(",").map(category => category.trim())
    //     : newPlayers.categories;

    const incomingPhoneNumbers =
      typeof newPlayers.phoneNumbers === "string"
        ? newPlayers.phoneNumbers.split(",").map(number => number.trim())
        : newPlayers.phoneNumbers;

    // data to send to backend
    const newItem = {
      tournamentId: currentTournament?._id,
      names: newPlayers.names,
      categories: selectedCategories,
      phoneNumbers: incomingPhoneNumbers
    };

    // console.log("Data sent to backend: ", newItem);

    if (socket) {
      // console.log("EMITTING SOCKET EVENT FOR ADD PLAYER");
      socket.emit("addPlayer", {
        playerData: newItem,
        tournamentId: currentTournament?._id
      });
    }

    setNewPlayers({
      names: "",
      categories: "",
      phoneNumbers: ""
    });

    // console.log(newPlayers);
  }

  // hides the components from guests
  if (!isSignedIn) return null;

  return (
    <>
      <div className="flex flex-col items-center justify-center my-4">
        <SectionHeader>Add new Players</SectionHeader>

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-6 bg-brick-200 text-shell-100 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded position-center">
          {`${isExpanded ? "hide " : "show"} the form`}
        </Button>
      </div>

      {isExpanded && (
        <form
          className="flex flex-row items-center my-10 justify-around px-4 mx-4"
          onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="names"
              value={newPlayers.names}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            />

            <label htmlFor="phoneNumbers">Phone Number</label>
            <input
              type="text"
              name="phoneNumbers"
              value={newPlayers.phoneNumbers}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            />

            <label htmlFor="categories">Categories</label>

            {/* <label htmlFor="tournamentId">Tournament</label> */}
            <select
              name="categories"
              value={newPlayers.categories}
              onChange={handleCategoryChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200">
              <option value="">Select categories</option>
              {currentTournament?.categories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCategories.map(category => (
                <span
                  key={category}
                  className=" my-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium">
                  {category}
                  <button
                    onClick={() => removeCategory(category)}
                    className="ml-2 text-sm text-white-500">
                    ✕
                  </button>
                </span>
              ))}
            </div>
            {/* <TournamentCategories items={newPlayers.categories} /> */}
          </div>

          <Button className=" ml-6 bg-brick-200 text-shell-100 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded">
            Add player
          </Button>
        </form>
      )}
    </>
  );
}
