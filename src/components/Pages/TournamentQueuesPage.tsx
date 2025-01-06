"use client";

import {useState, useEffect} from "react";
import SectionHeader from "@/components/SectionHeader";
import NewPlayerForm from "@/components/Forms/NewPlayerForm";
import PlayersList from "@/components/PlayersList";
import QueuesContainer from "@/components/Queue/QueuesContainer";
import ProcessedPlayers from "@/components/drafts/ProcessedPlayers";
import ButtonGroup from "@/components/Buttons/ButtonGroup";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import {usePathname} from "next/navigation";
import Tournament from "../Tournaments/TournamentCard";

export default function TournamentQueuesPage() {
  const [visibleSection, setVisibleSection] = useState("queues");
  const [thisTournamentId, setThisTournamentId] = useState(null);

  const pathname = usePathname();

  const {
    // fetchPlayersByTournamentId,
    setCurrentTournament,
    tournaments,
    currentTournamentPlayers
  } = useTournamentsAndQueuesContext();

  // Fetch players on component mount
  useEffect(() => {
    // console.log("IN THE USEEFECT FOR TOURNAMENTQUEUESPAGE")
    // console.log(thisTournamentId)

    const segments = pathname.split("/");
    const id = segments.pop();
    setThisTournamentId(id);

    if (thisTournamentId) {
      const thisTournament = tournaments.find(
        tournament => tournament._id === thisTournamentId
      );
      // console.log("THIS TOURNAMENT IS SET")
      // console.log(thisTournament)
      setCurrentTournament(thisTournament);
      // fetchPlayersByTournamentId(thisTournamentId);
    }
  }, [thisTournamentId]);

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
          <NewPlayerForm />
          <PlayersList
            title={"Unprocessed Players"}
            players={currentTournamentPlayers.unProcessedQItems}
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
          <SectionHeader>Processed Players</SectionHeader>
          <PlayersList
            title={"Processed Players"}
            players={currentTournamentPlayers.processedQItems}
          />
          {/* <ProcessedPlayers /> */}
        </div>
      </div>
    </>
  );
}
