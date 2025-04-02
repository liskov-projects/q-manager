"use client";
// hooks
import { useEffect } from "react";
import { useFavourites } from "@/context/FavouriteItemsContext";
import { useUser } from "@clerk/nextjs";
// types
import { TPlayer, TTournament } from "@/types/Types";
import StarItem from "@/Components/Buttons/StarItem";
// components
import Link from "next/link";
import SectionHeader from "@/Components/SectionHeader";

export default function Favourites() {
  const {
    favouritePlayers,
    getFavouritePlayers,
    favouriteTournaments,
    getFavouriteTournaments,
    appUser,
    getAppUserFromDB,
  } = useFavourites();

  return (
    <div>
      <SectionHeader>Favourite Players</SectionHeader>
      {appUser?.favouritePlayers.length === 0 ? (
        <span className="h-30 w-[85%] p-2 bg-shell-75 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2">
          No favourite players
        </span>
      ) : (
        <ul>
          {appUser?.favouritePlayers.map((player: TPlayer) => (
            <li
              key={player._id}
              className="h-30 w-[85%] p-2 bg-shell-75 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2"
            >
              <span className="ml-8 font-bold text-bluestone-200">{player.names}</span>
              <span className="text-bluestone-200"> in {player.tournamentName}</span>
              <StarItem playerId={player._id} />
            </li>
          ))}
        </ul>
      )}
      <SectionHeader className="mt-8">Favourite Tournaments</SectionHeader>
      {appUser?.favouriteTournaments.length === 0 ? (
        <span className="h-30 w-[85%] p-2 bg-shell-75 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2">
          No favourite tournaments
        </span>
      ) : (
        <ul>
          {appUser?.favouriteTournaments.map((tournamentId: string) => (
            <li
              key={tournamentId}
              className="h-30 w-[85%] p-2 bg-shell-75 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2"
            >
              {/* <span className="ml-8 font-bold text-bluestone-200">{tournament.name}</span> */}
              {/* <Link href={`/all-tournaments/${tournament._id}`}>Visit</Link> */}
              {/* <StarItem tournamentId={tournament._id} /> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
