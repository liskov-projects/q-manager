"use client";
// hooks
import { useState, useEffect } from "react";
import { useFavourites } from "@/context/FavouritePlayersContext";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
// types
import { TPlayer } from "@/types/Types";
import StarItem from "@/Components/Buttons/StarItem";

export default function Favourites() {
  const { favouritePlayers, setFavouritePlayers } = useFavourites();
  const { tournaments } = useTournamentsAndQueuesContext();

  //   console.log("favs in Favourites", favouritePlayers);

  return (
    <div>
      {favouritePlayers.length === 0 ? (
        <span className="text-lg text-red-500">No favourite players</span>
      ) : (
        <ul>
          {favouritePlayers.map((player: TPlayer) => (
            <li
              key={player._id}
              className="h-30 w-[85%] p-2 bg-shell-75 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2"
            >
              {player.names} {player.tournamentName}
              <StarItem />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
