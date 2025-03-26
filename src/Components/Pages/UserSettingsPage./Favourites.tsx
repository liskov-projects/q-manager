"use client";

import React from "react";
import { useFavourites } from "@/context/FavouritePlayersContext";

export default function Favourites() {
  const { favouritePlayers } = useFavourites();
  console.log(favouritePlayers);
  return <div>{favouritePlayers}</div>;
}
