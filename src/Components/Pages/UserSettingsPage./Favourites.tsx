"use client";
// hooks
import { useState } from "react";
import { useFavourites } from "@/context/FavouritePlayersContext";
// import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
// types
import { TPlayer } from "@/types/Types";
import StarItem from "@/Components/Buttons/StarItem";

export default function Favourites() {
  const { favouritePlayers } = useFavourites();

  return (
    <div>
      <h3>Favourite Players</h3>
      {!favouritePlayers ? (
        <span>No favourite players</span>
      ) : (
        <ul>
          {favouritePlayers.map((player: TPlayer) => (
            <li key={player._id}>
              {player.names} {player.tournamentName}
              <StarItem />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
