import {TTournament} from "@/types/Types";

const findPlayerInTournament = (tournament: TTournament, playerId: string) => {
  console.log("findPlayerInTournament runs");
  const player = tournament.processedQItems.find(player => player._id === playerId);
  if (player) return player;

  const unProcessedPlayer = tournament.unProcessedQItems.find(
    player => player._id === playerId
  );
  if (unProcessedPlayer) return unProcessedPlayer;

  tournament.queues.forEach(queue => {
    //   for (const queue of tournament.queues) {
    const playerInQueue = queue.queueItems.find(player => player._id === playerId);
    if (playerInQueue) return playerInQueue;
  });

  return null;
};

export default findPlayerInTournament;
