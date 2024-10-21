import Player from "./Player";
import QueueType from "./Queue";
// context type
interface AppContextType {
  players: Player[];
  queues: QueueType[];
  setQueues: React.Dispatch<React.SetStateAction<QueueType[]>>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  // the following return void because they update state
  markPlayerAsProcessed: (playerId: string) => void;
  handleDragStart: (draggedItem: Player) => void;
  handleDragOver: (e: React.MouseEvent<HTMLLIElement>) => void;
  handleDrop: (e: React.MouseEvent<HTMLLIElement>, targetItem: Player, queue: QueueType) => void;
}

export default AppContextType;
