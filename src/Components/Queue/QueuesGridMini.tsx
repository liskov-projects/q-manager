"use client";
// hooks
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
// types
import { TQueue } from "@/types/Types";

export default function QueuesGridAlternate() {
  const { currentTournament } = useTournamentsAndQueuesContext();

  const getBackgroundColor = (queueLength: number) => {
    return queueLength >= 4
      ? "bg-sky-400"
      : queueLength === 3
        ? "bg-yellow-300"
        : queueLength === 2
          ? "bg-orange-400"
          : queueLength === 1
            ? "bg-red-400"
            : queueLength === 0
              ? "bg-red-500"
              : "bg-green-200";
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {currentTournament?.queues.map((queue: TQueue) => (
        <div key={queue._id} className="aspect-square relative">
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center border-8 border-black text-center p-2 ${getBackgroundColor(
              queue.queueItems.length - 1
            )}`}
          >
            <h3 className="text-lg font-bold">{queue.queueName}</h3>
            <span className="text-xl font-bold">Q: {queue.queueItems.length}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
