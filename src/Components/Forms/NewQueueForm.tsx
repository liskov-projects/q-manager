"use client";
// hooks
import {useState} from "react";
import {useUser} from "@clerk/nextjs";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import {useSocket} from "@/context/SocketContext";
// types
import {TQueue} from "@/types/Types";
// components
import Button from "../Buttons/Button";

export default function NewQueueForm() {
  const {isSignedIn} = useUser();
  const {currentTournament, filteredTournaments, setCurrentTournament} =
    useTournamentsAndQueuesContext();
  // WORKS:
  const [canEdit, setCanEdit] = useState(false);
  const [newQueue, setNewQueue] = useState<TQueue>({
    queueName: "",
    queueItems: [],
    tournamentId: ""
  });
  // NEW:
  const {socket} = useSocket();

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

    // try {
    //   const res = await fetch("/api/queues", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(newItem)
    //   });

    //   // check response code
    //   if (res.ok) {
    //     const data = await res.json();
    //     console.log("Added: ", data);
    //     // setCurrentTournament(data);
    //   } else {
    //     console.error("Error response:", res);
    //     throw new Error("Error adding item, status: " + res.status);
    //   }
    // } catch (err: unknown) {
    //   if (err instanceof Error) {
    //     console.error("Error adding item: ", err.message);
    //   } else {
    //     console.error("Unknown error: ", err);
    //   }
    // }

    //NEW: socket goes here:
    if (socket) {
      // console.log("EMITTING SOCKET EVENT FOR ADD Queue");
      socket.emit("addQueue", {
        newQueue: newItem,
        tournamentId: currentTournament?._id
      });
    }
    //
    setNewQueue({
      queueName: "",
      queueItems: [],
      tournamentId: ""
    });
    setCanEdit(false);
  }

  // hides the components from guests
  if (!isSignedIn) return null;

  return (
    <div>
      {canEdit ? (
        <div className="flex flex-col rounded-lg shadow-left-bottom-lg p-2 flex flex-col border-3 border-grey-300">
          <Button onClick={() => setCanEdit(false)}>Cancel</Button>
          <form
            className="flex flex-col items-center my-4 justify-around px-2 mx-2"
            onChange={handleChange}
            onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="queueName"
                value={newQueue.queueName}
                onChange={handleChange}
                className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
              />

              {/* <label htmlFor="phoneNumbers">Players</label>
              <input
                type="text"
                name="queueItems"
                value={newQueue.queueItems}
                onChange={handleChange}
                className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
              /> */}

              {/* <label htmlFor="tournamentId">Tournament</label>
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
              </select> */}
            </div>

            <Button className="mt-4 bg-brick-200 text-shell-100 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded">
              Add the queue
            </Button>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setCanEdit(!canEdit)}
          className=" flex flex-col text-2xl font-semibold text-gray-400 hover:text-gray-300 shadow-lg shadow-gray-500/50 px-6 py-3 w-full text-center">
          Add more Queues
        </Button>
      )}
    </div>
  );
}
