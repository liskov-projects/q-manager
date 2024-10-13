import Button from "./Button";
import {useAppContext} from "@/Context/AppContext";
import useAddToQueues from "@/Hooks/useAddToQueues";

export default function ButtonGroup() {
  const {players, queues} = useAppContext();
  const {handleAddAllToQueues, handleRedistributeQueues, findAssignedToQueue} =
    useAddToQueues();

  return (
    <div className="flex flex-row justify-around">
      <Button
        className="bg-gray-300 text-black py-2 h-[45px] w-[250px] px-4 rounded"
        onClick={() => {
          // helper works here
          handleAddAllToQueues(findAssignedToQueue(players));
        }}>
        Add All Players to Queues
      </Button>
      <Button
        className="bg-blue-500 text-black py-2 h-[45px] w-[250px] px-4 rounded"
        onClick={() => {
          handleRedistributeQueues(queues);
        }}>
        Redestribute Players
      </Button>
    </div>
  );
}
