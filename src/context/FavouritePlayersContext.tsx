"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { TPlayer, TTournament } from "@/types/Types";
import { useTournamentsAndQueuesContext } from "./TournamentsAndQueuesContext";
// TODO: move into types
type TFavouritePlayersContext = {
  favouritePlayers: TPlayer[];
  setFavouritePlayers: React.Dispatch<React.SetStateAction<TPlayer[]>>;
  toggleFavouritePlayers: (playerId: string) => void;
};

const FavouritePlayersContext = createContext<TFavouritePlayersContext | null>(null);

export function FavouritePlayersProvider({ children }: { children: React.ReactNode }) {
  const [favouritePlayers, setFavouritePlayers] = useState<TPlayer[]>([]);
  const { tournaments } = useTournamentsAndQueuesContext();

  useEffect(() => {
    const fetchFavouritePlayers = async () => {
      try {
        const response = await fetch("/api/favouritePlayers", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        //  as expected
        // console.log("this is data:", data);

        // const updatedPlayers = data.map((favPlayer: TPlayer) => {
        //   console.log("tournamentS", tournaments);
        // as expected
        //   console.log("inside map for updated player");
        //   console.log("player", favPlayer);
        //   const foundTournament = tournaments.find((tournament: TTournament) => {
        //     console.log("tournament", tournament);
        //     console.log("favPlayer: ", favPlayer);
        //     tournament._id === favPlayer.tournamentId;
        //   });

        //   tournaments.find((tournament: TTournament) =>
        //     [tournament.queue.queueItems, tournament.unProcessedQItems, tournament.processedQItems]
        //       .flat()
        //       .some((item: TPlayer) => String(item._id) === favPlayer._id)
        //   );
        //   //   not coming through
        //   console.log("found tournament", foundTournament);
        //   return { ...favPlayer, tournamentName: foundTournament.name };
        setFavouritePlayers(data);

        // setFavouritePlayers(data);
      } catch (err) {
        console.error("error fetching favourite players");
      }
    };

    fetchFavouritePlayers();
  }, [tournaments]);

  console.log("FAVOURITE PLAYERS", favouritePlayers);

  const toggleFavouritePlayers = async (playerId: string) => {
    try {
      console.log("Sending request to backend...");
      const response = await fetch("/api/favouritePlayers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("fetch POST result: ", data);

      if (response.ok) {
        setFavouritePlayers(data);
      }
    } catch (error) {
      console.error("Error in toggleFavouritePlayers:", error);
    }
  };

  //   console.log("fav players: ", favouritePlayers);
  return (
    <FavouritePlayersContext.Provider
      value={{ favouritePlayers, setFavouritePlayers, toggleFavouritePlayers }}
    >
      {children}
    </FavouritePlayersContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritePlayersContext);
  if (!context) {
    throw new Error("useFavourites must be defined");
  }
  return context;
}
