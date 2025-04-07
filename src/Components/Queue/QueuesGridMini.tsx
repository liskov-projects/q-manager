"use client";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { TQueue } from "@/types/Types";
import { FaMoon, FaTableTennis } from "react-icons/fa";

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
            : "bg-red-500";
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 text-black">
      {currentTournament?.queues.map((queue: TQueue) => {
        const queueLength = queue.queueItems.length - 1;
        const isEmpty = queueLength <= 0;

        return (
          <div key={queue._id} className="aspect-square relative">
            <div
              className={`absolute inset-0 flex flex-col items-center justify-between border-8 border-black text-center p-2 ${getBackgroundColor(queueLength)}`}
            >
              {/* Queue name */}
              <h3 className="text-md font-bold">{queue.queueName}</h3>

              {/* Q or "No one is playing!" */}
              {isEmpty ? (
                <div className="text-lg font-bold">No one is playing!</div>
              ) : (
                <div className="flex items-center justify-center text-2xl font-extrabold">
                  <span className="mr-2">Q:</span>
                  <div className="w-10 h-10 bg-white border-4 border-black text-black rounded flex items-center justify-center text-xl font-black">
                    {queueLength}
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="text-3xl">
                {isEmpty ? (
                  <FaMoon title="No one on court" />
                ) : (
                  <FaTableTennis title="Player on court" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
