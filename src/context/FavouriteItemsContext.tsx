"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { TPlayer, TTournament, TFavouriteItemsContext } from "@/types/Types";
import { useTournamentsAndQueuesContext } from "./TournamentsAndQueuesContext";
import { useUser } from "@clerk/nextjs";

const FavouriteItemsContext = createContext<TFavouriteItemsContext | null>(null);

export function FavouriteItemsProvider({ children }: { children: React.ReactNode }) {
  const [favouritePlayers, setFavouritePlayers] = useState<TPlayer[]>([]);
  const [favouriteTournaments, setFavouriteTournaments] = useState<TPlayer[]>([]);
  const { tournaments } = useTournamentsAndQueuesContext();
  const { user } = useUser();
  const username = user?.username;
  // console.log(user);

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
        setFavouritePlayers(data);
      } catch (err) {
        console.error("error fetching favourite players");
      }
    };

    fetchFavouritePlayers();
  }, [tournaments]);

  //   console.log("FAVOURITE PLAYERS", favouritePlayers);
  const toggleFavouritePlayers = async (playerId: string, action: string) => {
    try {
      console.log("Sending request to backend...");
      const response = await fetch("/api/favouritePlayers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, username, action }),
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

  const toggleFavouriteTournaments = async (tournamentId: string) => {
    try {
      console.log("Sending request to backend...");
      const response = await fetch("/api/favouriteTournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId, username }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("fetch POST result: ", data);

      if (response.ok) {
        setFavouriteTournaments(data);
      }
    } catch (error) {
      console.error("Error in toggleFavouriteTournaments:", error);
    }
  };
  //   console.log("fav players: ", favouritePlayers);
  console.log("fav TOURNAMENTS: ", favouriteTournaments);
  return (
    <FavouriteItemsContext.Provider
      value={{
        favouritePlayers,
        setFavouritePlayers,
        toggleFavouritePlayers,
        favouriteTournaments,
        setFavouriteTournaments,
        toggleFavouriteTournaments,
      }}
    >
      {children}
    </FavouriteItemsContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouriteItemsContext);
  if (!context) {
    throw new Error("useFavourites must be defined");
  }
  return context;
}
