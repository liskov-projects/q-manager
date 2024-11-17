// context
import {useAppContext} from "@/context/QueuesContext";
//components
import Queue from "./Queue";
import React from "react";

export default function QueuesGrid() {
  const {queues} = useAppContext();
  // console.log("IN QUEUES GRID PLEASE WORK");
  // console.log(queues);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {queues.map((queue, index) => (
        <Queue key={queue.id} queue={queue} index={index} />
      ))}
    </div>
  );
}
