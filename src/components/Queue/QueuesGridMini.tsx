"use client";

import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import React from "react";
import {TQueue} from "@/types/Types";

export default function QueuesGridAlternate() {
  const {currentTournament} = useTournamentsAndQueuesContext();

  // Function to get background color based on queue length
  const getBackgroundColor = (queueLength: number) => {
    return queueLength >= 4
      ? "bg-sky-400" // Friendly sky-blue for 4+ items
      : queueLength === 3
      ? "bg-yellow-300" // Slightly urgent color for 3 items
      : queueLength === 2
      ? "bg-orange-400" // More alarming color for 2 items
      : queueLength === 1
      ? "bg-red-400" // Most urgent color for 1 item
      : queueLength === 0
      ? "bg-red-500"
      : "bg-green-200"; // Neutral color for empty queue
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {currentTournament.queues.map((queue: TQueue) => (
        <div
          key={queue._id}
          className={`flex flex-col items-center justify-center h-24 w-24 border-8 border-black ${getBackgroundColor(
            queue.queueItems.length
          )}`}>
          <h3 className="text-center text-lg font-bold">{queue.queueName}</h3>
          <span className="text-xl font-bold">{queue.queueItems.length}</span>
        </div>
      ))}
    </div>
  );
}
