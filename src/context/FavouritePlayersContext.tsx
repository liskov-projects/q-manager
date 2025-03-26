"use client";

import { createContext, useContext, useEffect, useState } from "react";

// TODO: move into types
type TFavouritePlayersContext = {
  favouritePlayers: string[];
  toggleFavouritePlayers: (playerId: string) => void;
};

const FavouritePlayersContext = createContext<TFavouritePlayersContext | null>(null);

export function FavouritePlayersProvider({ children }: { children: React.ReactNode }) {
  const [favouritePlayers, setFavouritePlayers] = useState<string[]>([]);

  useEffect(() => {
    const fetchFavouritePlayers = async () => {
      try {
        const response = await fetch("/api/favouritePlayers", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        console.log("this is the data", data.favouritePlayers);
        setFavouritePlayers(data.favouritePlayers);
      } catch (err) {
        console.error("error fetching favourite players");
      }
    };

    fetchFavouritePlayers();
  }, []);

  const toggleFavouritePlayers = async (playerId: string) => {
    console.log("Toggling favourite for player:", playerId);

    setFavouritePlayers((prev) => {
      console.log("Previous favouritePlayers:", prev);
      const updatedFavouritePlayers = prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId];
      console.log("Updated favouritePlayers (local state):", updatedFavouritePlayers);
      return updatedFavouritePlayers;
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
      console.error("Error in toggleFavouritePlayers:", error);
    }
  };

  console.log("FAV PLAYERS: ", favouritePlayers);
  return (
    <FavouritePlayersContext.Provider value={{ favouritePlayers, toggleFavouritePlayers }}>
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
