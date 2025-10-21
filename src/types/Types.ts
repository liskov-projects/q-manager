import mongoose from "mongoose";
// Player Type
export type TPlayer = {
  _id?: string; // Optional ID from MongoDB
  names?: string;
  categories?: string[]; // A single category or multiple
  phoneNumbers?: string[];
  tournamentId: string; // The ID of the associated tournament
};

// Queue Type
export type TQueue = {
  _id?: string; // Queue identifier
  queueName: string; // Name of the queue
  queueItems: TPlayer[]; // Players in the queue
  tournamentId: string; // The associated tournament (TODO)
};

// Tournament Type
export type TTournament = {
  _id?: string; // Tournament ID from MongoDB
  name: string; // Tournament name
  adminUser: string; // User ID of the admin
  image: string;
  queues: TQueue[];
  processedQItems: TPlayer[];
  unProcessedQItems: TPlayer[];
  description: string;
  categories: string[];
};

// User Type
export type TUser = {
  _id?: string;
  clerkId: string;
  username: string;
  phoneNumber?: string;
  favouritePlayers: string[];
  favouriteTournaments: string[];
  notificationPreference: boolean;
};

// Tournament and Queues Context Props
export type TTournamentsAndQueuesContextProps = {
  addMoreQueues: () => void; // Add a new queue
  removeQueues: () => void; // Remove a queue
  draggedItem: TPlayer | null; // Currently dragged player
  setDraggedItem: React.Dispatch<React.SetStateAction<TPlayer | null>>;
  uniqueCategories: string[]; // List of unique player categories
  currentTournament?: TTournament | null; // The currently active tournament
  setCurrentTournament: React.Dispatch<React.SetStateAction<TTournament | null>>;
  currentTournamentRef: React.MutableRefObject<TTournament | null>;
  tournamentOwner: boolean | undefined;
  tournaments: TTournament[]; // List of all tournaments
  setTournaments: React.Dispatch<React.SetStateAction<TTournament[]>>;
  filteredTournaments: TTournament[]; // Tournaments filtered by criteria
  fetchTournaments: () => Promise<void>; // Fetch tournaments from the server
  saveTournament: () => Promise<void>;
  fetchNewPlayers: (tournamentId: string) => Promise<void>; // Fetch players from the server,
  addPlayerToTournament: (playerData: TPlayer, tournamentId: string) => void;
};

export type TFavouriteItemsContext = {
  favouritePlayers: TPlayer[];
  setFavouritePlayers: React.Dispatch<React.SetStateAction<TPlayer[]>>;
  toggleFavouritePlayers: (playerId: string) => void;
  favouriteTournaments: TTournament[];
  setFavouriteTournaments: React.Dispatch<React.SetStateAction<TTournament[]>>;
  toggleFavouriteTournaments: (tournamentId: string) => void;
};

// NOTE: not used anywhere
// // Route Context Props
// export type TRouteContextProps = {
//   isGuest: boolean; // Whether the user is a guest
//   setIsGuest: (isGuest: boolean) => void; // Update guest status
// };
