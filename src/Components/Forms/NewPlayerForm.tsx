"use client";

import {useState} from "react";
// import {useRouteContext} from "@/context/RouteContext";
import {useUser} from "@clerk/nextjs";
// components
import Button from "../Buttons/Button";
import {TPlayer} from "@/types/Types";
import SectionHeader from "../SectionHeader";
// import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
// import TTournament from "@/types/Tournament";

export default function NewPlayerForm() {
  const {isSignedIn} = useUser();
  const {currentTournament, filteredTournaments} = useTournamentsAndQueuesContext();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [newPlayers, setNewPlayers] = useState<TPlayer>({
    name: "",
    categories: "",
    phoneNumber: "",
    // NEW:
    tournamentId: ""
    //
  });
  // NEW:
  // console.log("within the form ", currentTournament);
  // console.log("tournamentID: ", currentTournament?._id);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) {
    setNewPlayers({...newPlayers, [e.target.name]: e.target.value});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // console.log("New player data: ", newPlayers.phoneNumbers.split(","));

    const incomingCategories =
      typeof newPlayers.categories === "string"
        ? newPlayers.categories.split(",").map(category => category.trim())
        : newPlayers.categories;

    const incomingPhoneNumbers =
      typeof newPlayers.phoneNumber === "string"
        ? newPlayers.phoneNumber.split(",").map(number => number.trim())
        : newPlayers.phoneNumber;

    // data to send to backend
    const newItem = {
      names: newPlayers.name,
      categories: incomingCategories,
      phoneNumbers: incomingPhoneNumbers,
      assignedToQueue: false,
      processThroughQueue: false,
      // NEW:
      tournamentId: currentTournament?._id
      //
    };

    // console.log("Data sent to backend: ", newItem);

    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newItem)
      });

      // check response code
      if (res.ok) {
        const data = await res.json();
        console.log("Added: ", data);
      } else {
        console.error("Error response:", res);
        throw new Error("Error adding item, status: " + res.status);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error adding item: ", err.message);
      } else {
        console.error("Unknown error: ", err);
      }
    }

    // FIXME:
    // ressetting the form
    setNewPlayers({
      name: "",
      categories: "",
      phoneNumber: "",
      tournamentId: ""
    });
    // console.log(newPlayers);
  }

  // hides the components from guests
  // if (isGuest) return null;
  if (!isSignedIn) return null;

  return (
    <>
      <div className="flex flex-col items-center justify-center my-4 ">
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
              value={newPlayers.name}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            />

            <label htmlFor="categories">Categories</label>
            <input
              type="text"
              name="categories"
              value={newPlayers.categories}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            />

            <label htmlFor="phoneNumbers">Phone Number</label>
            <input
              type="text"
              name="phoneNumbers"
              value={newPlayers.phoneNumber}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            />

            <label htmlFor="tournamentId">Tournament</label>
            <select
              name="tournamentId"
              value={newPlayers.tournamentId}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200">
              <option value="">Select a tournament</option>
              {filteredTournaments?.map((tournament, idx) => (
                <option key={idx} value={tournament._id}>
                  {tournament.name}
                </option>
              ))}
            </select>
          </div>

          <Button className=" ml-6 bg-brick-200 text-shell-100 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded">
            Add player
          </Button>
        </form>
      )}
    </>
  );
}
