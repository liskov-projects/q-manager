import QueueType from "./Queue";
import PlayerType from "./Player";

type TournamentType = {
  _id?: string;
  name: string;
  categories?: string | string[];
  image?: string;
  description?: string;
  queues?: QueueType[];
  players?: PlayerType[];
};

export default TournamentType;
