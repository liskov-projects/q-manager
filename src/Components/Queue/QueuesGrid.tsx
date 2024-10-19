// context
import {useAppContext} from "@/Context/AppContext";
//components
import Queue from "./Queue";
import React from "react";

export default function QueuesGrid() {
  const {queues} = useAppContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-[80vh] overflow-hidden hover:overflow-y-auto">
      {queues.map((queue, index) => (
        <Queue key={queue.id} queue={queue} index={index} />
      ))}
    </div>
  );
}
