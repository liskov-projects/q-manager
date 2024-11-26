"use client";

// context
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
//components
import Queue from "./Queue";
import React from "react";
import {TQueue} from "@/types/Types";

export default function QueuesGrid() {
  const {currentTournament} = useTournamentsAndQueuesContext();
  // console.log("IN QUEUES GRID PLEASE WORK");
  // console.log(queues);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {currentTournament?.queues.map((queue: TQueue, index: number) => (
        <Queue key={queue.id} queue={queue} index={index} />
      ))}
    </div>
  );
}
