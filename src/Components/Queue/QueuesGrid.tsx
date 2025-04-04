"use client";
// context
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
// types
import { TQueue } from "@/types/Types";
// components
import Queue from "./Queue";
import React from "react";
import NewQueueForm from "../Forms/NewQueueForm";

export default function QueuesGrid() {
  const { currentTournament } = useTournamentsAndQueuesContext();

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:cols-4 gap-3">
      {currentTournament?.queues.map((queue: TQueue, index: number) => (
        <Queue key={queue._id} queue={queue} index={index} />
      ))}
      <NewQueueForm />
    </div>
  );
}
