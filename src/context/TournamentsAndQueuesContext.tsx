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
import {TPlayer, TTournament, TTournamentsAndQueuesContextProps} from "@/types/Types";

const TournamentsAndQueuesContext = createContext<
  TTournamentsAndQueuesContextProps | undefined
>(undefined);

export const TournamentsAndQueuesProvider = ({children}: {children: ReactNode}) => {
  //NOTE: Queues are derived from the tournament state

  //FIXME: not used anywhere
  // // const [players, setPlayers] = useState<TPlayer[]>([]);
  const [draggedItem, setDraggedItem] = useState<TPlayer | null>(null);

  // Tournaments State
  const [tournaments, setTournaments] = useState<TTournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<TTournament | null>();
  // const [currentTournamentPlayers, setCurrentTournamentPlayers] =
  //   useState<TTournamentPlayersState>({
  //     unProcessedQItems: [],
  //     processedQItems: []
  //   });

  const pathname = usePathname();
  const {isSignedIn, user} = useUser();
  // console.log(user, "user");
  console.log("in the context", currentTournament);
  const tournamentOwner = isSignedIn && user.id === currentTournament?.adminUser;

  // Fetch Players and Tournaments on Mount
  useEffect(() => {
    // console.log("RUNNING HERE IN USEEFFECT");
    // fetchPlayers();
    fetchTournaments();
  }, []);

  // WORKS: sets both the tournamnet and its players | Sync Current Tournament with URL Pathname
  // FIXME: needs to get the updated list of players for a particular tournament | a separate useEffect?
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
  // console.log("in the context", currentTournament);

  // Filtered Tournaments
  const filteredTournaments = tournaments.filter(
    tournament => tournament.adminUser === user?.id
  );

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

  // FIXME: will update the players INSIDE the tournament
  // const fetchNewPlayers = async () => {
  //   // console.log("THIS (FETCH PLAYERS?!!");
  //   const response = await fetch("../api/players/");
  //   const playersData = await response.json();
  //   const playersForTournament = playersData.filter(
  //     (player: TPlayer) => player.tournamentId === currentTournament?._id
  //   );

  //   // comes through
  //   console.log("fetchPlayers playerForTourn: ", playersForTournament);
  //   setCurrentTournamentPlayers(playersForTournament);
  // };

  //WORKS: as expected gets ALL tournaments
  const fetchTournaments = async () => {
    const response = await fetch(`/api/tournaments/`);
    const tournamentsData = await response.json();
    setTournaments(tournamentsData);
    // comes through as expected
    // console.log("Tournaments");
    // console.log(tournamentsData);
  };

  // NEW:
  // "NOTE" is this even needed?
  // const fetchPlayersByTournamentId = async (tournamentId: string) => {
  //   // console.log("TRYING TO FETCH PLAYERS");
  //   // console.log("TOURNAMENT ID");
  //   // console.log(tournamentId);

  //   if (!tournamentId) {
  //     console.error("Tournament ID is required to fetch data");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`/api/tournaments/${tournamentId}/`);
  //     if (!response.ok) {
  //       throw new Error(`Error fetching tournament: ${response.statusText}`);
  //     }

  //     const tournamentData = await response.json();
  //     const tournamentPlayersData = tournamentData.queues.flatMap(
  //       queue => queue.queueItems || []
  //     );
  //     // coming through
  //     // console.log("IN THE CONTEXT: ", tournamentPlayersData);
  //     // console.log(currentTournamentPlayers);
  //     //this works
  //     setCurrentTournamentPlayers(tournamentPlayersData);
  //   } catch (error) {
  //     console.error("Error fetching tournament:", error);
  //   }
  // };

  // coming through
  // console.log(currentTournamentPlayers);

  //WORKS: Derived Categories from Players
  const uniqueCategories = useMemo(() => {
    const categories = tournaments.flatMap(tournament => tournament.categories || []);
    return Array.from(new Set(categories));
  }, [currentTournament]);
  // console.log(uniqueCategories);

  // "FIXME:"
  const saveTournament = async tournamentId => {
    // comes through OK
    // console.log(tournamentId);
    console.log("BEFORE TRY: ", currentTournament);

    try {
      const res = await fetch(`/api/tournaments/${tournamentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(currentTournament)
      });

      if (!res.ok) {
        throw new Error(`Error saving tournaments: ${res.statusText}`);
      }

      const dataToPost = await res.json();
      console.log("Tournament saved!", dataToPost);
    } catch (err) {
      console.error("Failed to save tournament: ", err);
    }
  };

  // REVIEW: are these used anywhere???
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
        // fetchNewPlayers,
        // fetchPlayersByTournamentId,
        // currentTournamentPlayers,
        tournamentOwner,
        // setCurrentTournamentPlayers,
        saveTournament
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
