import PlayerType from "./Player";
import QueueType from "./Queue";
import TournamentType from "./Tournament";
// context type
interface QueuesContextType {
  players: PlayerType[];
  queues: QueueType[];
  tournaments: TournamentType[];
  draggedItem: PlayerType | null;
  uniqueCategories: string[];
  fetchPlayers: () => Promise<void>;
  fetchTournaments: () => Promise<void>;
  setQueues: React.Dispatch<React.SetStateAction<QueueType[]>>;
  setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>;
  setTournaments: React.Dispatch<React.SetStateAction<TournamentType[]>>;
  updatePlayers: (updatedPlayers: PlayerType[]) => void;
  updateQueues: (updatedQueues: QueueType[]) => void;
  setDraggedItem: React.Dispatch<React.SetStateAction<PlayerType | null>>;
  // the following return void because they update state
  markPlayerAsProcessed: (playerId: string) => void;
  // DEV:
  initialQueues: QueueType[];
  addMoreQueues: (queues: QueueType[]) => void;
  removeQueues: (queues: QueueType[]) => void;
}

export default QueuesContextType;
