import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {useAppContext} from "@/Context/AppContext";
import useAddToQueues from "@/Hooks/useAddToQueues";

//REVIEW: why have to pass queueID? if taken out here doesn't change anything see PlayerItem
export default function ButtonUpDown(item, queueId) {
  const {queues, setQueues, setPlayers} = useAppContext();
  const {handleProgressOneStep} = useAddToQueues();

  const itemToMove = item.item;
  const movingIn = item.queueId;

  function handleUp(itemToMove, movingIn) {
    const currentQueue = queues.find(queue => queue.id === movingIn);
    if (!currentQueue) return;
    // console.log("current queue ", currentQueue);

    const queueToUpdate = [...currentQueue?.queueItems];
    const itemToMoveIndex = queueToUpdate?.findIndex(
      item => item.id === itemToMove.id
    );
    // console.log(itemToMoveIndex);

    if (itemToMoveIndex === 0) {
      const queueIndex = queues.findIndex(queue => queue.id === currentQueue?.id);

      handleProgressOneStep(queueIndex);
    } else {
      // removes the draggeed item (draggedItem - what to move, 1 - items to remove)
      queueToUpdate.splice(itemToMoveIndex, 1);
      // inserts without removing elements (target - where to; 0 - items to remove; draggedItem - what is moved)
      queueToUpdate.splice(itemToMoveIndex - 1, 0, itemToMove);

      setQueues(prevQueues => {
        return prevQueues.map(q => {
          if (q.id === movingIn) {
            return {...q, queueItems: queueToUpdate};
          } else {
            return q;
          }
        });
      });
    }
  }

  function handleDown() {
    const currentQueue = queues.find(queue => queue.id === movingIn);
    if (!currentQueue) return;
    // console.log("current queue ", currentQueue);
    // NEW:
    const queueToUpdate = [...currentQueue?.queueItems];
    const itemToMoveIndex = queueToUpdate?.findIndex(
      item => item.id === itemToMove.id
    );
    // console.log(itemToMoveIndex);

    if (itemToMoveIndex >= 0) {
      // removes the draggeed item (draggedItem - what to move, 1 - items to remove)
      queueToUpdate.splice(itemToMoveIndex, 1);
      // inserts without removing elements (target - where to; 0 - items to remove; draggedItem - what is moved)
      queueToUpdate.splice(itemToMoveIndex + 1, 0, itemToMove);
    }

    setQueues(prevQueues => {
      return prevQueues.map(q => {
        if (q.id === movingIn) {
          return {...q, queueItems: queueToUpdate};
        } else {
          return q;
        }
      });
    });
  }

  return (
    <div className="flex flex-col">
      <FontAwesomeIcon
        icon={faCaretUp}
        className="bg-black cursor-pointer"
        onClick={() => handleUp(itemToMove, movingIn)}
      />
      <FontAwesomeIcon
        icon={faCaretDown}
        className="bg-black cursor-pointer"
        onClick={() => handleDown()}
      />
    </div>
  );
}
