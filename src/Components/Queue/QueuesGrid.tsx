//types
import QueueType from "@/types/Queue";
//components
import Queue from "./Queue";

export default function QueuesGrid({
  queues,
  onProgress,
  setQueues
}: {
  queues: QueueType[];
  // this function returns a promise that resolves to a QueueType => Promise<QueueType[]>?
  onProgress: (index: number) => QueueType[];
  setQueues: (queues: QueueType[]) => QueueType[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {queues.map((queue, index) => (
        <Queue
          key={queue.id}
          //REVIEW: move classname directly on the returned div? = fewer props to pass
          className={
            "bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between"
          }
          onProgress={onProgress}
          queue={queue}
          index={index}
          setQueues={setQueues}
        />
      ))}
    </div>
  );
}
