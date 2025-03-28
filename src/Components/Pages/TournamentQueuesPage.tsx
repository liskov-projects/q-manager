"use client";
// hooks
import { useState } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
// components
import PlayersList from "@/Components/PlayersList";
import QueuesContainer from "@/Components/Queue/QueuesContainer";
import ButtonGroup from "@/Components/Buttons/ButtonGroup";
// import NewQueueForm from "../Forms/NewQueueForm";
import NewPlayerForm from "../Forms/NewPlayerForm";

export default function TournamentQueuesPage({ tournamentId }) {
  const [visibleSection, setVisibleSection] = useState("queues");

  const { currentTournament, tournamentOwner } = useTournamentsAndQueuesContext();

  // console.log(currentTournament)

  // FIXME: barely seen on the screen | STYLE
  if (!currentTournament) {
    return <div className="flex self-center">Loading...</div>; // Add a loading state
  }

  return (
    <>
      {/* Mobile toggle button group */}
      <div className="lg:hidden flex justify-around my-4">
        <button onClick={() => setVisibleSection("queues")} className="p-2 bg-sky-200 rounded">
          Queues
        </button>
        <button onClick={() => setVisibleSection("unprocessed")} className="p-2 bg-sky-200 rounded">
          Unprocessed
        </button>
        <button onClick={() => setVisibleSection("processed")} className="p-2 bg-sky-200 rounded">
          Processed
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-around px-2">
        {/* Section for adding players and viewing unprocessed list */}
        <div
          className={`p-1 w-full lg:w-1/5 ${
            visibleSection === "unprocessed" ? "block" : "hidden lg:block"
          }`}
        >
          <NewPlayerForm />
          <PlayersList
            title={"Unprocessed Players"}
            players={currentTournament.unProcessedQItems}
            zone={"unprocessed"}
          />
        </div>

        <div
          className={`p-1 w-full lg:w-3/5 ${
            visibleSection === "queues" ? "block" : "hidden lg:block"
          }`}
        >
          {/* FIXME: buttons for users that don't manage tourn where they toggle show only their fav players */}

          <QueuesContainer />
        </div>

        {/* Processed players section */}
        <div
          className={`p-1 w-full lg:w-1/5 ${
            visibleSection === "processed" ? "block" : "hidden lg:block"
          }`}
        >
          {/* <SectionHeader>Button Group</SectionHeader> */}
          <ButtonGroup tournamentId={tournamentId} />
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
