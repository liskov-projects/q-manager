"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode
} from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Types
import {TQueue, TPlayer, TTournament, TTournamentsAndQueuesContextProps} from "@/types/Types";

const TournamentsAndQueuesContext = createContext<TTournamentsAndQueuesContextProps | undefined>(undefined);

export const TournamentsAndQueuesProvider = ({ children }: { children: ReactNode }) => {

//   const [queues, setQueues] = useState<TQueue[]>(initialQueues);
  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [draggedItem, setDraggedItem] = useState<TPlayer | null>(null);

  // Tournaments State
  const [tournaments, setTournaments] = useState<TTournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<TTournament | null>(null);
  const pathname = usePathname();
  const { user } = useUser();

  // Filtered Tournaments
  const filteredTournaments = tournaments.filter(
    (tournament) => tournament.adminUser === user?.id
  );

  // Derived Categories from Players
  const uniqueCategories = useMemo(() => {
    const categories = players.flatMap((player) => player.categories || []);
    return Array.from(new Set(categories));
  }, [players]);

  // Add or Remove Queues
//   const addMoreQueues = () => {
//     setQueues((prev) => [
//       ...prev,
//       {
//         queueName: (queues.length + 1).toString(),
//         queueItems: [],
//         id: queues.length.toString()
//       }
//     ]);
//   };

//   const removeQueues = () => {
//     setQueues((prev) => prev.slice(0, -1));
//   };

  // Mark Player as Processed
  const markPlayerAsProcessed = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player._id === playerId ? { ...player, processedThroughQueue: true } : player
      )
    );
  };

  // Fetch Players
  const fetchPlayers = async () => {
    console.log("THIS (FETCH PLAYERS?!!")
    const response = await fetch("../api/players/");
    const playersData = await response.json();
    const playersForTournament = playersData.filter(
      (player: TPlayer) => player.tournamentId === currentTournament?._id
    );
    setPlayers(playersForTournament);
  };

  // Fetch Tournaments
  const fetchTournaments = async () => {
    const response = await fetch("../api/tournaments/");
    const tournamentsData = await response.json();
    setTournaments(tournamentsData);
  };

  // Update Players and Queues
  const updatePlayers = (updatedPlayers: TPlayer[]) => setPlayers(updatedPlayers);
//   const updateQueues = (updatedQueues: TQueue[]) => setQueues(updatedQueues);

  // Sync Current Tournament with URL Pathname
  useEffect(() => {
    console.log("Current Pathname:", pathname);
    console.log("Current Tournaments:", tournaments);
    console.log("Current Tournament:", currentTournament);
    const segments = pathname.split("/");
    const id = segments.pop();

    if (id && tournaments.length > 0) {
      const foundTournament = tournaments.find((tournament) => tournament._id === id);
      console.log("CURRENT TOURNAMENT");
      console.log(foundTournament)
      if (foundTournament) {
        setCurrentTournament(foundTournament);
      }
    }
  }, [pathname, tournaments]);

  // Fetch Players and Tournaments on Mount
  useEffect(() => {
    console.log("RUNNING HERE IN USEEFFECT")
    fetchPlayers();
    fetchTournaments();
  }, [currentTournament]);

  return (
    <TournamentsAndQueuesContext.Provider
      value={{
        players,
        setPlayers,
        markPlayerAsProcessed,
        queues,
        setQueues,
        addMoreQueues,
        removeQueues,
        draggedItem,
        setDraggedItem,
        uniqueCategories,
        updatePlayers,
        updateQueues,
        currentTournament,
        tournaments,
        setCurrentTournament,
        setTournaments,
        filteredTournaments,
        fetchTournaments,
        fetchPlayers
      }}
    >
      {children}
    </TournamentsAndQueuesContext.Provider>
  );
};

export const useTournamentsAndQueuesContext = (): TTournamentsAndQueuesContextProps => {
  const context = useContext(TournamentsAndQueuesContext);
  if (!context) {
    throw new Error("useTournamentsAndQueuesContext must be used within a TournamentsAndQueuesProvider");
  }
  return context;
};
