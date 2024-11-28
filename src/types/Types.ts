// src/types/types.ts

// Player Type
export type TPlayer = {
  _id?: string; // Optional ID from MongoDB
  names?: string; // Changed `names` to `name` for clarity
  categories?: string | string[]; // A single category or multiple
  phoneNumbers?: string; // Singular for consistency
  assignedToQueue?: boolean;
  processedThroughQueue?: boolean;
  tournamentId: string; // The ID of the associated tournament
};

// Queue Type
export type TQueue = {
  id?: string; // Queue identifier
  queueName: string; // Name of the queue
  queueItems: TPlayer[]; // Players in the queue
  tournamentId: string; // The associated tournament (TODO)
};

// Tournament Type
export type TTournament = {
  _id?: string; // Tournament ID from MongoDB
  name: string; // Tournament name
  adminUser: string; // User ID of the admin
  queues: TQueue[];
};

// Tournament and Queues Context Props
export type TTournamentsAndQueuesContextProps = {
  players: TPlayer[];
  setPlayers: React.Dispatch<React.SetStateAction<TPlayer[]>>;
  markPlayerAsProcessed: (playerId: string) => void; // Mark a player as processed
  queues: TQueue[];
  setQueues: React.Dispatch<React.SetStateAction<TQueue[]>>;
  addMoreQueues: () => void; // Add a new queue
  removeQueues: () => void; // Remove a queue
  draggedItem: TPlayer | null; // Currently dragged player
  setDraggedItem: React.Dispatch<React.SetStateAction<TPlayer | null>>;
  uniqueCategories: string[]; // List of unique player categories
  updatePlayers: (updatedPlayers: TPlayer[]) => void; // Update players state
  updateQueues: (updatedQueues: TQueue[]) => void; // Update queues state
  currentTournament?: TTournament | null; // The currently active tournament
  tournaments: TTournament[]; // List of all tournaments
  setCurrentTournament: React.Dispatch<React.SetStateAction<TTournament | null>>;
  setTournaments: React.Dispatch<React.SetStateAction<TTournament[]>>;
  filteredTournaments: TTournament[]; // Tournaments filtered by criteria
  fetchTournaments: () => Promise<void>; // Fetch tournaments from the server
  fetchPlayers: () => Promise<void>; // Fetch players from the server,
  fetchPlayersByTournamentId: (id: string) => Promise<void>;
  currentTournamentPlayers: TPlayer[];
  tournamentOwner: boolean;
};

// Route Context Props
export type TRouteContextProps = {
  isGuest: boolean; // Whether the user is a guest
  setIsGuest: (isGuest: boolean) => void; // Update guest status
};
