"use client";
// hooks
import { useState, useEffect } from "react";
import { useFavourites } from "@/context/FavouritePlayersContext";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
// types
import { TPlayer } from "@/types/Types";
import StarItem from "@/Components/Buttons/StarItem";

export default function Favourites() {
  const { favouritePlayers } = useFavourites();
  const [playersData, setPlayersData] = useState<TPlayer[]>([]);
  const { tournaments } = useTournamentsAndQueuesContext();

  useEffect(() => {
    if (favouritePlayers.length === 0) return;

    function getPlayersData() {
      const foundPlayers: TPlayer[] = [];

      favouritePlayers.forEach((playerId: string) => {
        // looks for players in the queues
        for (const tournament of tournaments) {
          for (const queue of tournament.queues) {
            const player = queue.queueItems.find((item: TPlayer) => item._id === playerId);
            if (player) {
              foundPlayers.push({
                ...player,
                tournamentName: tournament.name,
              });
            }
          }
          // looks for players in un/processed
          const foundInProcessed = tournament.processedQItems.find(
            (item: TPlayer) => item._id === playerId
          );
          if (foundInProcessed) {
            foundPlayers.push({ ...foundInProcessed, tournamentName: tournament.name });
          }

          const foundInUnProcessed = tournament.unProcessedQItems.find(
            (item: TPlayer) => item._id === playerId
          );
          if (foundInUnProcessed) {
            foundPlayers.push({ ...foundInProcessed, tournamentName: tournament.name });
          }
        }
      });
      setPlayersData(foundPlayers);
    }

    getPlayersData();
  }, [favouritePlayers]);

  return (
    <div>
      <h3>Favourite Players</h3>
      {playersData?.length === 0 ? (
        <span>No favourite players</span>
      ) : (
        <ul>
          {playersData.map((player) => (
            <li key={player._id}>
              {player.names} ({player.tournamentName})
              <StarItem />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
