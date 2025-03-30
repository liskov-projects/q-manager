import { TQueue } from "@/types/Types";

const QueueStatus = ({ queue }: { queue: TQueue }) => {
  const queueLength = queue.queueItems.length - 1; // Exclude "on court" item

  // Determine background color based on queue length
  const backgroundColor =
    queueLength >= 4
      ? "bg-sky-400" // Friendly sky-blue for 4+ items
      : queueLength === 3
        ? "bg-yellow-300" // Slightly urgent color for 3 items
        : queueLength === 2
          ? "bg-orange-400" // More alarming color for 2 items
          : queueLength === 1
            ? "bg-red-400" // Most urgent color for 1 item
            : queueLength === 0
              ? "bg-red-500"
              : "bg-blue-900"; // Neutral color for empty queue

  // Determine the display message based on queue status
  const displayMessage =
    queue.queueItems.length === 0 ? (
      <div className="flex flex-col items-center text-white">
        <div> No one on court </div>
        <img src="/snoopy-sleeping.gif" alt="No one on court" className="w-32 h-auto mx-auto" />
      </div>
    ) : queueLength > 0 ? (
      <div className="flex items-center justify-between">
        <span>Number in queue:</span>
        <span className="ml-2 flex items-center justify-center w-12 h-12 border-4 border-black bg-slate-200 text-black font-bold">
          {queueLength}
        </span>
      </div>
    ) : (
      <div className="flex items-center justify-between">
        <span>Queue is empty</span>
        <span className="ml-2 flex items-center justify-center w-12 h-12 border-4 border-black bg-slate-200 text-black font-bold">
          0
        </span>
      </div>
    );

  return (
    <div
      className={`p-2 rounded text-black font-extrabold ${backgroundColor} border-2 border-gray-400`}
    >
      {displayMessage}
    </div>
  );
};

export default QueueStatus;
