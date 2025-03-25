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
    setFavourites((prev) =>
      //   if (!prev) return;
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    );

    await fetch("api/user/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    });
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
