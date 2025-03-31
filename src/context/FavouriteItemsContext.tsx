"use client";

import { createContext, useContext, useState } from "react";
import { TPlayer, TFavouriteItemsContext } from "@/types/Types";

const FavouriteItemsContext = createContext<TFavouriteItemsContext | null>(null);

export function FavouriteItemsProvider({ children }: { children: React.ReactNode }) {
  const [favouritePlayers, setFavouritePlayers] = useState<TPlayer[]>([]);
  const [favouriteTournaments, setFavouriteTournaments] = useState<TPlayer[]>([]);

  const getFavouritePlayers = async () => {
    try {
      console.log("Sending request to backend...");
      const response = await fetch("/api/favouritePlayers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("fetch GET result: ", data);

      if (response.ok) {
        setFavouritePlayers(data);
      }
    } catch (error) {
      console.error("Error in toggleFavouritePlayers:", error);
    }
  };

  const addPlayerToFavourites = async (playerId: string) => {
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
        getFavouritePlayers();
      }
    } catch (error) {
      console.error("Error in toggleFavouritePlayers:", error);
    }
  };

  const removeFavouritePlayer = async (playerId: string) => {
    console.log(playerId, "in remove fav player");
    try {
      console.log("Sending request to backend...");
      const response = await fetch("/api/favouritePlayers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("fetch DELETE result: ", data);

      if (response.ok) {
        getFavouritePlayers();
      }
    } catch (error) {
      console.error("Error in toggleFavouritePlayers:", error);
    }
  };

  //   console.log("fav players: ", favouritePlayers);
  // console.log("fav TOURNAMENTS: ", favouriteTournaments);

  return (
    <FavouriteItemsContext.Provider
      value={{
        favouritePlayers,
        setFavouritePlayers,
        addPlayerToFavourites,
        removeFavouritePlayer,
        getFavouritePlayers,
        favouriteTournaments,
        setFavouriteTournaments,
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
