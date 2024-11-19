import QueueType from "./Queue";
import PlayerType from "./Player";

type TournamentType = {
  _id?: string;
  name: string;
  adminUser: string;
  categories: string[];
  image: string;
  description: string;
  queues?: number;
  // players?: PlayerType[] | undefined;
};

export default TournamentType;
