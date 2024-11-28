// enables the tournamentOwner check
"use client";
import QueuesPage from "@/components/Pages/QueuesPage";
import NewQueueForm from "@/components/Forms/NewQueueForm";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";

export default function TournamentPage({params}: {params: {_id: string}}) {
  const {tournamentOwner} = useTournamentsAndQueuesContext();
  return (
    <div>
      <h1 className="text-center text-2xl font-bold">
        {/* TODO: change */}
        Tournament name: {params._id}
      </h1>
      {tournamentOwner && <NewQueueForm />}
      <QueuesPage />
    </div>
  );
}
