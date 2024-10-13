// context
import {useAppContext} from "@/Context/AppContext";
//types
import QueueType from "@/types/Queue";
//components
import Queue from "./Queue";
import React from "react";

export default function QueuesGrid({}: // queues,
// onProgress,
// setQueues
{
  queues: QueueType[];
  // this function returns a promise that resolves to a QueueType => Promise<QueueType[]>?
  onProgress: (index: number) => QueueType[];
  // because of a callback in setQueues
  setQueues: React.Dispatch<React.SetStateAction<QueueType[]>>;
}) {
  const {queues} = useAppContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {queues.map((queue, index) => (
        <Queue
          key={queue.id}
          className={
            "bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between"
          }
          queue={queue}
          index={index}
        />
      ))}
    </div>
  );
}
