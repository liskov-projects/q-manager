import { TTournament } from "@/types/Types";
import { ObjectId } from "mongodb";

const findPlayerInTournament = (tournament: TTournament, playerId: string) => {
  const playerObjectId = new ObjectId(playerId);

  console.log("findPlayerInTournament runs");
  console.log("tournament: ", tournament);

  //   console.log(Array.isArray(tournament.queues));
  //   console.log(typeof tournament.queues);

  const player = tournament.processedQItems.find((player) => player._id.equals(playerObjectId));
  if (player) return player;

  const unProcessedPlayer = tournament.unProcessedQItems.find((player) =>
    player._id.equals(playerObjectId)
  );
  if (unProcessedPlayer) return unProcessedPlayer;

  //   tournament.queues.forEach(queue => {
  for (const queue of tournament.queues) {
    const playerInQueue = queue.queueItems.find((player) => player._id.equals(playerObjectId));
    if (playerInQueue) return playerInQueue;
  }

  return null;
};

export default findPlayerInTournament;
