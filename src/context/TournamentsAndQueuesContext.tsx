"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode
} from "react";
import {usePathname} from "next/navigation";
import {useUser} from "@clerk/nextjs";

// Types
import {
  TQueue,
  TPlayer,
  TTournament,
  TTournamentsAndQueuesContextProps
} from "@/types/Types";

const TournamentsAndQueuesContext = createContext<
  TTournamentsAndQueuesContextProps | undefined
>(undefined);

export const TournamentsAndQueuesProvider = ({children}: {children: ReactNode}) => {
  //NOTE: Queues are derived from the tournament state

  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [draggedItem, setDraggedItem] = useState<TPlayer | null>(null);

  // Tournaments State
  const [tournaments, setTournaments] = useState<TTournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<TTournament | null>(
    null
  );

  const [currentTournamentPlayers, setCurrentTournamentPlayers] = useState<TPlayer[]>(
    []
  );

  const pathname = usePathname();
  const {isSignedIn, user} = useUser();
  // console.log(user, "user");
  // NEW:
  const tournamentOwner = isSignedIn && user.id === currentTournament?.adminUser;

  // Sync Current Tournament with URL Pathname
  useEffect(() => {
    // console.log("Current Pathname:", pathname);
    // console.log("Tournaments:", tournaments);
    // console.log("Current Tournament:", currentTournament);
    const segments = pathname.split("/");
    const id = segments.pop();

    if (id && tournaments.length > 0) {
      const foundTournament = tournaments.find(tournament => tournament._id === id);
      // console.log("Found TOURNAMENT");
      // console.log(foundTournament);
      if (foundTournament) {
        setCurrentTournament(foundTournament);
      }
    }
  }, [pathname, tournaments]);

  // Fetch Players and Tournaments on Mount
  useEffect(() => {
    // console.log("RUNNING HERE IN USEEFFECT");
    // fetchPlayers();
    fetchTournaments();
  }, []);

  // Filtered Tournaments
  const filteredTournaments = tournaments.filter(
    tournament => tournament.adminUser === user?.id
  );

  // Derived Categories from Players
  const uniqueCategories = useMemo(() => {
    const categories = players.flatMap(player => player.categories || []);
    return Array.from(new Set(categories));
  }, []);

  // FIXME: what if they want to add another queue on the go?
  // Add or Remove Queues
  const addMoreQueues = () => {
    const newQueue = {
      queueName: (queues.length + 1).toString(),
      queueItems: [],
      id: queues.length.toString()
    };
    setQueues(prev => [...prev]);
  };
  const removeQueues = () => {
    setQueues(prev => prev.slice(0, -1));
  };

  const markPlayerAsProcessed = (playerId: string) => {
    setPlayers(prev =>
      prev.map(player =>
        player._id === playerId ? {...player, processedThroughQueue: true} : player
      )
    );
  };

  // Fetch Players FIXME:
  const fetchPlayers = async () => {
    // console.log("THIS (FETCH PLAYERS?!!");
    const response = await fetch("../api/players/");
    const playersData = await response.json();
    const playersForTournament = playersData.filter(
      (player: TPlayer) => player.tournamentId === currentTournament?._id
    );
    setPlayers(playersForTournament);
  };

  // Fetch Tournaments
  const fetchTournaments = async () => {
    const response = await fetch(`/api/tournaments/`);
    const tournamentsData = await response.json();
    setTournaments(tournamentsData);
  };

  const fetchPlayersByTournamentId = async (tournamentId: string) => {
    // console.log("TRYING TO FETCH PLAYERS");
    // console.log("TOURNAMENT ID");
    // console.log(tournamentId);

    if (!tournamentId) {
      // console.error("Tournament ID is required to fetch data");
      return;
    }

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/`);
      if (!response.ok) {
        throw new Error(`Error fetching tournament: ${response.statusText}`);
      }

      // NEW: coming through OK
      const tournamentPlayersData = await response.json();

      console.log("IN THE CONTEXT: ", tournamentPlayersData);
      console.log(currentTournamentPlayers);

      setCurrentTournamentPlayers(tournamentPlayersData); // Assuming `setTournament` updates a single tournament in state
    } catch (error) {
      console.error("Error fetching tournament:", error);
    }
  };

  // Update Players and Queues
  const updatePlayers = (updatedPlayers: TPlayer[]) => setPlayers(updatedPlayers);
  // const updateQueues = (updatedQueues: TQueue[]) => setQueues(updatedQueues);

  // const queues = currentTournament?.queues;
  // console.log(queues);

  return (
    <TournamentsAndQueuesContext.Provider
      value={{
        players,
        setPlayers,
        markPlayerAsProcessed,
        // queues,
        // setQueues,
        // addMoreQueues,
        // removeQueues,
        draggedItem,
        setDraggedItem,
        uniqueCategories,
        updatePlayers,
        // updateQueues,
        currentTournament,
        tournaments,
        setCurrentTournament,
        setTournaments,
        filteredTournaments,
        fetchTournaments,
        fetchPlayers,
        fetchPlayersByTournamentId,
        currentTournamentPlayers,
        tournamentOwner,
        setCurrentTournamentPlayers
      }}>
      {children}
    </TournamentsAndQueuesContext.Provider>
  );
};

export const useTournamentsAndQueuesContext =
  (): TTournamentsAndQueuesContextProps => {
    const context = useContext(TournamentsAndQueuesContext);
    if (!context) {
      throw new Error(
        "useTournamentsAndQueuesContext must be used within a TournamentsAndQueuesProvider"
      );
    }
    return context;
  };
