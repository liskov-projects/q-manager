"use client";
// context
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useFavourites } from "@/context/FavouriteItemsContext";
// types
import { TQueue, TPlayer } from "@/types/Types";
// components
import Queue from "./Queue";
import React from "react";
import NewQueueForm from "../Forms/NewQueueForm";

export default function QueuesGrid({ showsFavourites }: { showsFavourites: boolean }) {
  const { currentTournament } = useTournamentsAndQueuesContext();
  const { favouritePlayers } = useFavourites();

  const filteredQueues = currentTournament.queues.map((queue: TQueue) => {
    if (!showsFavourites) return queue;

    // iterates over all queues & items in them to find the faves and mark non-faves as hidden
    return {
      ...queue,
      queueItems: queue.queueItems.map((item: TPlayer) => ({
        ...item,
        // hides the item if it's not in the faves
        isHidden: !favouritePlayers.some((fav: TPlayer) => fav._id === item._id),
      })),
    };
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {filteredQueues.map((queue: TQueue, index: number) => (
        <Queue key={queue._id} queue={queue} index={index} />
      ))}
      <NewQueueForm />
    </div>
  );
}
