import Button from "./Button";
import {useAppContext} from "@/Context/AppContext";
import useAddToQueues from "@/Hooks/useAddToQueues";

export default function ButtonGroup() {
  const {players, queues} = useAppContext();
  const {
    handleAddAllToQueues,
    handleRedistributeQueues,
    findAssignedToQueue,
    handleProcessAll,
    handleUnprocessAll
  } = useAddToQueues();

  return (
    <div className="flex flex-col justify-around m-6">
      <div className="flex ">
        <Button
          className="bg-gray-300 text-black py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2"
          onClick={() => {
            // helper works here
            handleAddAllToQueues(findAssignedToQueue(players));
          }}>
          Add All Players to Queues
        </Button>
        <Button
          className="bg-blue-500 text-black py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2"
          onClick={() => {
            handleRedistributeQueues(queues);
          }}>
          Redestribute Players
        </Button>
      </div>
      <div className="flex">
        <Button
          className="bg-red-500 text-black py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2"
          onClick={() => {
            handleProcessAll(players);
          }}>
          Process all Players
        </Button>
        <Button
          className="bg-green-500 text-black py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2"
          onClick={() => {
            handleUnprocessAll(players);
          }}>
          Unprocess all Players
        </Button>
      </div>
    </div>
  );
}
