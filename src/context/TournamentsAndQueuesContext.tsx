"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  ReactNode
} from "react";
import {useParams} from "next/navigation";
import {useUser} from "@clerk/nextjs";

// Types
import {TPlayer, TTournament, TTournamentsAndQueuesContextProps} from "@/types/Types";

const TournamentsAndQueuesContext = createContext<
  TTournamentsAndQueuesContextProps | undefined
>(undefined);

export const TournamentsAndQueuesProvider = ({children}: {children: ReactNode}) => {
  const [draggedItem, setDraggedItem] = useState<TPlayer | null>(null);

  // Tournaments State
  const [tournaments, setTournaments] = useState<TTournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<TTournament | null>(
    null
  );
  const currentTournamentRef = useRef<TTournament | null>(null);

  const params = useParams();

  const {isSignedIn, user} = useUser();
  // console.log(user, "user");
  // console.log("in the context", currentTournament);
  const tournamentOwner = isSignedIn && user.id === currentTournament?.adminUser;

  useEffect(() => {
    currentTournamentRef.current = currentTournament;
  }, [currentTournament]);

  useEffect(() => {
    // console.log("RUNNING HERE IN USEEFFECT");
    // fetchPlayers();
    fetchTournaments();
  }, []);

  // WORKS: sets both the tournamnet and its players | Sync Current Tournament with URL Pathname
  useEffect(() => {
    // console.log("CURRENT TOURNAMENT SETTING USEEFFECT");

    // console.log("PARAMS ID", params);

    const tournamentId = Array.isArray(params.id) ? params.id[0] : null;

    if (!tournamentId) {
      console.warn("⚠️ No tournament ID found in URL.");
      return;
    }

    fetchTournament(tournamentId);
  }, [params?.id]); // ✅ Runs when `pathname` changes

  // Fetch the single tournament directly from the API
  const fetchTournament = async (tournamentId: string) => {
    try {
      // console.log("Fetching tournament:", tournamentId);
      const response = await fetch(`/api/tournament/${tournamentId}`);

      if (!response.ok) {
        throw new Error(`Error fetching tournament: ${response.statusText}`);
      }

      const tournamentData = await response.json();
      // console.log("Tournament fetched:", tournamentData);
      setCurrentTournament(tournamentData);
    } catch (error) {
      console.error("Failed to fetch tournament:", error);
    }
  };

  // WORKS: socket-related
  const addPlayerToTournament = (playerData, tournamentId) => {
    // console.log("addPlayerToTournament RAN");
    // console.log("CURRENT TOURNAMENT IN ADDPLAYERFROMSOCKET", currentTournament);
    // console.log("currentTournamentREF.current:", currentTournamentRef.current);

    if (currentTournamentRef.current) {
      setCurrentTournament(prevTournament => {
        // console.log("PREV TOURNAMENT")
        // console.log(prevTournament)
        if (!prevTournament) return prevTournament; // Ensure prevTournament exists
        // console.log("SETTING THE TOURNAMENT");
        return {
          ...prevTournament, // Create a new tournament object
          unProcessedQItems: [...prevTournament.unProcessedQItems, playerData] // Create a new array
        };
      });
    }
  };

  // Filtered Tournaments
  const filteredTournaments = tournaments.filter(
    tournament => tournament.adminUser === user?.id
  );

  // to get the newest players after one is added
  const fetchNewPlayers = async (tournamentId: string) => {
    try {
      const response = await fetch(`/api/tournament/${tournamentId}`);
      const playersData = await response.json();

      const playersForTournament = playersData.filter(
        (player: TPlayer) => player.tournamentId === tournamentId
      );

      console.log("Fetched Players: ", playersForTournament);

      setCurrentTournament(prevTournament =>
        prevTournament
          ? {...prevTournament, unprocessedPlayers: playersForTournament}
          : prevTournament
      );
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  //WORKS: Adds Queues
  const addMoreQueues = () => {
    const newQueue = {
      queueName: (currentTournament.queues.length + 1).toString(),
      queueItems: [],
      id: currentTournament.queues.length.toString()
    };

    setCurrentTournament(prevTournament => {
      if (!prevTournament) return prevTournament;
      return {
        ...prevTournament,
        queues: [...prevTournament?.queues, newQueue]
      };
    });
  };

  //WORKS: Removes Queues
  const removeQueues = () => {
    setCurrentTournament(prevTournament => {
      if (!prevTournament) return prevTournament;
      return {
        ...prevTournament,
        queues: prevTournament.queues.slice(0, -1)
      };
    });
  };

  //WORKS: as expected gets ALL tournaments
  const fetchTournaments = async () => {
    const response = await fetch(`/api/tournament/`);
    const tournamentsData = await response.json();
    setTournaments(tournamentsData);
  };

  //WORKS: Derived Categories from Players for one tournament
  const uniqueCategories = useMemo(() => {
    const categories = tournaments.flatMap(tournament => tournament.categories || []);
    return Array.from(new Set(categories));
  }, [tournaments]);

  // console.log("in the context ", uniqueCategories);

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

  return (
    <TournamentsAndQueuesContext.Provider
      value={{
        addMoreQueues,
        removeQueues,
        draggedItem,
        setDraggedItem,
        uniqueCategories,
        currentTournament,
        tournaments,
        setCurrentTournament,
        setTournaments,
        filteredTournaments,
        fetchTournaments,
        tournamentOwner,
        saveTournament,
        fetchNewPlayers,
        addPlayerToTournament,
        currentTournamentRef
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
