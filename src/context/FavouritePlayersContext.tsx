"use client";

import { createContext, useContext, useState } from "react";

// TODO: move into types
type TFavouritePlayersContext = {
  favourites: string[];
  toggleFavourite: (playerId: string) => void;
};

const FavouritePlayersContext = createContext<TFavouritePlayersContext | null>(null);

export function FavouritePlayersProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>([]);

  const toggleFavourite = async (playerId: string) => {
    console.log("Toggling favourite for player:", playerId);

    setFavourites((prev) => {
      console.log("Previous favourites:", prev);
      const updatedFavourites = prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId];
      console.log("Updated favourites (local state):", updatedFavourites);
      return updatedFavourites;
    });

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
    } catch (error) {
      console.error("Error in toggleFavourite:", error);
    }
  };

  console.log("FAV PLAYERS: ", favourites);
  return (
    <FavouritePlayersContext.Provider value={{ favourites, toggleFavourite }}>
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
