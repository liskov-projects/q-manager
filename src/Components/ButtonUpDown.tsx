import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {useAppContext} from "@/Context/AppContext";

// props here are passed from queue and item in Queue.tsx through PlayerItem.tsx
export default function ButtonUpDown(item, queueId) {
  const {queues, setQueues, players, setPlayers} = useAppContext();
  console.log(item);
  function handleUp(itemId, queueIndex) {
    console.log("up ", itemId, queueIndex);
  }

  function handleDown(itemId, queueIndex) {
    console.log("down ", itemId, queueIndex);
  }

  return (
    <div className="flex flex-col">
      <FontAwesomeIcon
        icon={faCaretUp}
        className="bg-black cursor-pointer"
        onClick={() => handleUp(item.id, queueId)}
      />
      <FontAwesomeIcon
        icon={faCaretDown}
        className="bg-black cursor-pointer"
        onClick={() => handleDown(item.id, queueId)}
      />
    </div>
  );
}
