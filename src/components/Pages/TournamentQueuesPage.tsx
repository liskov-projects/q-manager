"use client";

import {useState, useEffect} from "react";
import NewPlayerForm from "@/components/Forms/NewPlayerForm";
import PlayersList from "@/components/PlayersList";
import QueuesContainer from "@/components/Queue/QueuesContainer";
import ButtonGroup from "@/components/Buttons/ButtonGroup";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import {usePathname} from "next/navigation";
// NEW:
import io from "socket.io-client";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export default function TournamentQueuesPage({thisTournamentId}) {
  const [visibleSection, setVisibleSection] = useState("queues");
  // const [thisTournamentId, setThisTournamentId] = useState(null);
  // NEW:
  const [socket, setSocket] = useState(null);
  const pathname = usePathname();

  const {
    // fetchPlayersByTournamentId,
    setCurrentTournament,
    tournaments,
    // currentTournamentPlayers,
    currentTournament
  } = useTournamentsAndQueuesContext();

  useEffect(() => {
    if (thisTournamentId && tournaments.length > 0) {
      const thisTournament = tournaments.find(
        tournament => tournament._id === thisTournamentId
      );
      setCurrentTournament(thisTournament);
    }
  }, [thisTournamentId, tournaments]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    // cleanup func to stop the socket
    return () => newSocket.disconnect;
    // shouldn't there be a dependency? we want this to run more than once?
  }, []);

  useEffect(() => {
    // guard so TS doesn't yell
    if (!socket || !thisTournamentId) return;

    socket.on("tournamentUpdated", updatedTournament => {
      if (updatedTournament._id === thisTournamentId) {
        setCurrentTournament(updatedTournament);
      }
    });
    return () => {
      socket.off("updatedTournament");
    };
  }, [socket, thisTournamentId]);
  //

  // FIXME: barely seen on the screen | STYLE
  if (!currentTournament) {
    return <div className="flex self-center">Loading...</div>; // Add a loading state
  }

  return (
    <>
      {/* Mobile toggle button group */}
      <div className="lg:hidden flex justify-around my-4">
        <button
          onClick={() => setVisibleSection("queues")}
          className="p-2 bg-sky-200 rounded">
          Queues
        </button>
        <button
          onClick={() => setVisibleSection("unprocessed")}
          className="p-2 bg-sky-200 rounded">
          Unprocessed
        </button>
        <button
          onClick={() => setVisibleSection("processed")}
          className="p-2 bg-sky-200 rounded">
          Processed
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-around">
        {/* Section for adding players and viewing unprocessed list */}
        <div
          className={`p-2 w-full lg:w-1/4 ${
            visibleSection === "unprocessed" ? "block" : "hidden lg:block"
          }`}>
          <NewPlayerForm socket={socket} tournamentId={thisTournamentId} />
          <PlayersList
            title={"Unprocessed Players"}
            players={currentTournament.unProcessedQItems}
            zone={"unprocessed"}
          />
        </div>

        <div
          className={`p-2 w-full lg:w-2/4 ${
            visibleSection === "queues" ? "block" : "hidden lg:block"
          }`}>
          <QueuesContainer />
        </div>

        {/* Processed players section */}
        <div
          className={`p-2 w-full lg:w-1/4 ${
            visibleSection === "processed" ? "block" : "hidden lg:block"
          }`}>
          {/* <SectionHeader>Button Group</SectionHeader> */}
          <ButtonGroup tournamentId={thisTournamentId} />
          <PlayersList
            title={"Processed Players"}
            players={currentTournament.processedQItems}
            zone={"processed"}
          />
          {/* <ProcessedPlayers /> */}
        </div>
      </div>
    </>
  );
}
