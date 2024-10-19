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
    // FIXME: like the idea of colorfull btn here
    <div className="flex flex-col justify-around h-50 my-12">
      <div className="flex ">
        <Button
          className="bg-bluestone-200 hover:bg-tennis-100 text-shell-100 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2"
          onClick={() => {
            // helper works here
            handleAddAllToQueues(findAssignedToQueue(players));
          }}>
          Add All
        </Button>
        <Button
          className="bg-brick-200 hover:bg-tennis-100 text-shell-100 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2"
          onClick={() => {
            handleRedistributeQueues(queues);
          }}>
          Redestribute
        </Button>
      </div>
      <div className="flex">
        <Button
          className="bg-brick-200 hover:bg-tennis-100 text-shell-100 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2"
          onClick={() => {
            handleUnprocessAll(players);
          }}>
          Unprocess all
        </Button>
        <Button
          className="bg-bluestone-200 hover:bg-tennis-100 text-shell-100 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2"
          onClick={() => {
            handleProcessAll(players);
          }}>
          Process all
        </Button>
      </div>
    </div>
  );
}
