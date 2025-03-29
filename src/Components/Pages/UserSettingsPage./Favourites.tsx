"use client";
// hooks
import { useState, useEffect } from "react";
import { useFavourites } from "@/context/FavouriteItemsContext";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
// types
import { TPlayer, TTournament } from "@/types/Types";
import StarItem from "@/Components/Buttons/StarItem";
// components
import SectionHeader from "@/Components/SectionHeader";

export default function Favourites() {
  const { favouritePlayers, setFavouritePlayers, favouriteTournaments } = useFavourites();

  //   console.log("favsPl in Favourites", favouritePlayers);
  //   console.log("favsTourn in Favourites", favouriteTournaments);

  return (
    <div>
      <SectionHeader>Favourite Players</SectionHeader>
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
      <SectionHeader>Favourite Tournaments</SectionHeader>
      {favouriteTournaments.length === 0 ? (
        <span className="text-lg text-bluestone-200">No favourite tournaments</span>
      ) : (
        <ul>
          {favouriteTournaments.map((tournament: TTournament) => (
            <li
              key={tournament._id}
              className="h-30 w-[85%] p-2 bg-shell-75 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2"
            >
              {tournament.name}
              <StarItem />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
