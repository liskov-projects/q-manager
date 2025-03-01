"use client";
import {useState} from "react";
import {useUser} from "@clerk/nextjs";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import {TQueue} from "@/types/Types";
import Button from "../Buttons/Button";
import SectionHeader from "../SectionHeader";

// fixme
// controlled input
export default function NewQueueForm() {
  const {isSignedIn} = useUser();
  const {currentTournament, filteredTournaments} = useTournamentsAndQueuesContext();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [newQueue, setNewQueue] = useState<TQueue>({
    queueName: "",
    queueItems: [],
    tournamentId: ""
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) {
    setNewQueue({...newQueue, [e.target.name]: e.target.value});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // data to send to backend
    const newItem = {
      queueName: newQueue.queueName,
      queueItems: newQueue.queueItems,
      tournamentId: currentTournament?._id
    };

    console.log("Data sent to backend: ", newItem);

    try {
      const res = await fetch("/api/tournament", {
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

    setNewQueue({
      queueName: "",
      queueItems: [],
      tournamentId: ""
    });
  }

  // hides the components from guests
  if (!isSignedIn) return null;

  return (
    <>
      <div className="flex flex-col items-center justify-center my-4 ">
        <SectionHeader>Add a Queue</SectionHeader>

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
              name="queueNames"
              value={newQueue.queueName}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            />

            <label htmlFor="phoneNumbers">Players</label>
            <input
              type="text"
              name="queueItems"
              value={newQueue.queueItems}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            />

            <label htmlFor="tournamentId">Tournament</label>
            <select
              name="tournamentId"
              value={newQueue.tournamentId}
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
            Add a queue
          </Button>
        </form>
      )}
    </>
  );
}
