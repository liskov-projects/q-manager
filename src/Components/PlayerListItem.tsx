import {useState} from "react";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import useDragNDrop from "@/hooks/useDragNDrop";
import {TPlayer} from "@/types/Types";
import Button from "./Buttons/Button"; // Adjust the import if the button is in a different path
import TagsList from "./TagsList";
import Modal from "./Modal";

export default function PlayerListItem({
  item,
  className,
  onAddToQueue
}: {
  item: TPlayer;
  className: string;
  queueId?: string;
  onAddToQueue: () => void;
}) {
  const {tournamentOwner} = useTournamentsAndQueuesContext();
  const {handleDragStart, handleDragOver} = useDragNDrop();
  // NEW:
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <li
        key={item._id}
        className={`h-30 p-4 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2 ${className}`}
        draggable={`${!tournamentOwner ? false : true}`}
        onDragStart={() => handleDragStart(item)}
        onDragOver={e => handleDragOver(e)}>
        {/* Player Name */}
        <div className="player-name font-semibold text-lg">
          {item.names}
          <Button className="px-5 py-2 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center">
            ✏️
          </Button>
        </div>

        {/* Tags List */}
        <TagsList item={item} />

        {/* Add to Shortest Queue Button */}
        {!tournamentOwner ? null : (
          <Button
            onClick={onAddToQueue}
            className="px-10 py-5 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out h-[70%] w-[30%] flex items-center justify-center">
            ADD TO SHORTEST QUEUE ⬆️
          </Button>
        )}
      </li>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-bold mb-4">Edit Player Information</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Player Name</label>
            <input
              type="text"
              defaultValue={item.names}
              className="border rounded-md px-4 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Phone Numbers
            </label>
            <input
              type="text"
              defaultValue={item.phoneNumbers.join(", ")}
              className="border rounded-md px-4 py-2 w-full"
            />
          </div>
          <Button
            onClick={() => {
              // Save logic here
              closeModal();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded">
            Save Changes
          </Button>
        </form>
      </Modal>
    </>
  );
}
