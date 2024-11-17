import Button from "./Button";
import {useAppContext} from "@/context/QueuesContext";
import {useRouteContext} from "@/context/RouteContext";

import useAddToQueues from "@/hooks/useAddToQueues";
import SectionHeader from "../SectionHeader";

export default function ButtonGroup() {
  const {players, queues} = useAppContext();
  const {isGuest} = useRouteContext();

  const {
    handleAddAllToQueues,
    handleRedistributeQueues,
    findAssignedToQueue,
    handleProcessAll,
    handleUnprocessAll
  } = useAddToQueues();

  // hides the components from guests
  if (isGuest) return null;

  return (
    <div className="my-4">
      <SectionHeader>Button Group</SectionHeader>
      {/* // FIXME: like the idea of colorful btn here */}
      <div className="flex flex-col justify-around h-50 my-12">
        <div className="flex">
          <Button
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-100 hover:text-shell-300 py-2 h-[45px] w-[800px] px-4 rounded my-2 mx-2 min-w-30 text-nowrap"
            onClick={() => {
              handleAddAllToQueues(findAssignedToQueue(players));
            }}>
            Add all
          </Button>
          <Button
            className="bg-brick-200 hover:bg-tennis-100 text-shell-100 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              handleRedistributeQueues(queues);
            }}>
            Redestribute
          </Button>
        </div>
        <div className="flex">
          <Button
            className="bg-brick-200 hover:bg-tennis-100 text-shell-100 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              handleUnprocessAll(players);
            }}>
            Unprocess all
          </Button>
          <Button
            className="bg-bluestone-200 hover:bg-tennis-100 text-shell-100 hover:text-shell-300 py-2 h-[45px] w-[250px] px-4 rounded my-2 mx-2 text-nowrap"
            onClick={() => {
              handleProcessAll(players);
            }}>
            Process all
          </Button>
        </div>
      </div>
    </div>
  );
}
