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
    <div className="grid gap-5 text-black grid-cols-[repeat(auto-fit,minmax(165px,1fr))]">
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-3 gap-5 text-black"> */}
      {currentTournament?.queues.map((queue: TQueue) => {
        const queueLength = queue.queueItems.length - 1;
        const isEmpty = queueLength <= 0;

        return (
          <div key={queue._id} className="aspect-square relative">
            <div
              className={`absolute inset-0 flex flex-col items-center justify-between border-8 border-black text-center p-2 ${getBackgroundColor(queueLength)}`}
            >
              {/* Queue name */}
              <h3 className="text-xl px-2 py-2 bg-white border-4 border-black text-black rounded flex items-center justify-center font-black">
                {queue.queueName}
              </h3>

              {/* Q or "No one is playing!" */}
              {queue.queueItems.length === 0 ? (
                <div className="text-2xl lg:text-xl font-bold px-[3px] py-[1px] bg-white border-4 border-black text-black rounded">
                  No one on court!
                </div>
              ) : (
                <div className="flex items-center justify-center text-2xl font-extrabold">
                  <span className="mr-2">Q:</span>
                  <div className="w-14 h-14 bg-white border-4 border-black text-black rounded flex items-center justify-center text-3xl font-black">
                    {queueLength}
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="text-3xl">
                {queue.queueItems.length === 0 ? (
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
