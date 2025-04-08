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
import BulkImport from "./UserSettingsPage/BulkImport";

export default function TournamentQueuesPage({ tournamentId }: { tournamentId: string }) {
  const [visibleSection, setVisibleSection] = useState("queues");
  const [showAlternateView, setShowAlternateView] = useState(false);
  const [showsFavourites, setShowsFavourites] = useState(false);

  const { currentTournament, tournamentOwner } = useTournamentsAndQueuesContext();

  // console.log(currentTournament)

  // FIXME: barely seen on the screen | STYLE
  if (!currentTournament) {
    return <div className="flex self-center">Loading...</div>; // Add a loading state
  }

  return (
    <>
      {/* Mobile toggle button group */}
      <div className="md:hidden flex justify-around my-4">
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
      <div className="flex flex-col">
        <ButtonGroup
          tournamentId={tournamentId}
          showsFavourites={showsFavourites}
          setShowsFavourites={setShowsFavourites}
          showAlternateView={showAlternateView}
          setShowAlternateView={setShowAlternateView}
        />
        <div className="flex flex-col lg:flex-row justify-around px-1">
          {/* Section for adding players and viewing unprocessed list */}
          <div
            className={`p-2 w-full lg:w-1/5 xl:w-1/6 ${
              visibleSection === "unprocessed" ? "block" : "hidden lg:block"
            }`}
          >
            {tournamentOwner && <NewPlayerForm />}
            {/* IMPORTANT: where to put? WORKS: */}
            {/* {tournamentOwner && <BulkImport tournamentId={tournamentId} />} */}
            <PlayersList
              title={"Unprocessed Matches"}
              players={currentTournament.unProcessedQItems}
              zone={"unprocessed"}
            />
          </div>

          <div
            className={`p-1 w-full lg:w-3/5 xl:w-4/6 ${
              visibleSection === "queues" ? "block" : "hidden lg:block"
            }`}
          >
            {/* FIXME: buttons for users that don't manage tourn where they toggle show only their fav players */}

            <QueuesContainer
              showAlternateView={showAlternateView}
              showsFavourites={showsFavourites}
            />
          </div>

          {/* Processed players section */}
          <div
            className={`p-1 w-full lg:w-1/5 xl:w-1/6 ${
              visibleSection === "processed" ? "block" : "hidden lg:block"
            }`}
          >
            {/* <SectionHeader>Button Group</SectionHeader> */}
            <PlayersList
              title={"Processed Matches"}
              players={currentTournament.processedQItems}
              zone={"processed"}
            />
            {/* <ProcessedPlayers /> */}
          </div>
        </div>
      </div>
    </>
  );
}
