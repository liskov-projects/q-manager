import React from "react";

const QueueStatus = ({ queue }) => {
  const queueLength = queue.queueItems.length - 1; // Exclude "on court" item

  // Determine background color based on queue length
  const backgroundColor = 
    queueLength >= 4 ? "bg-sky-400" :        // Friendly sky-blue for 4+ items
    queueLength === 3 ? "bg-yellow-300" :    // Slightly urgent color for 3 items
    queueLength === 2 ? "bg-orange-400" :    // More alarming color for 2 items
    queueLength === 1 ? "bg-red-400" :       // Most urgent color for 1 item
    queueLength === 0 ? "bg-red-500" :
    "bg-green-200";                           // Neutral color for empty queue

  // Determine the display message based on queue status
  const displayMessage = 
    queueLength > 0 ? `Number in queue: ${queueLength}` :
    queue.queueItems.length === 0 ? "No one on court" :
    "Queue is empty";

  return (
    <div className={`p-4 rounded text-black font-bold ${backgroundColor}`}>
      {displayMessage}
    </div>
  );
};

export default QueueStatus;
