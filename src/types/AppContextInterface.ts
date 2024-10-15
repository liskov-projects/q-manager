// context type
interface AppContextType {
  players: Player[];
  queues: QueueType[];
  setQueues: React.Dispatch<React.SetStateAction<QueueType[]>>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  // should return QueueTyep[]?
  markPlayerAsProcessed: (playerId: string) => QueueType[];
}

export default AppContextType;
