"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  ReactNode,
} from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Types
import { TPlayer, TTournament, TTournamentsAndQueuesContextProps } from "@/types/Types";

const TournamentsAndQueuesContext = createContext<TTournamentsAndQueuesContextProps | undefined>(
  undefined
);

export const TournamentsAndQueuesProvider = ({ children }: { children: ReactNode }) => {
  const [draggedItem, setDraggedItem] = useState<TPlayer | null>(null);

  // Tournaments State
  const [tournaments, setTournaments] = useState<TTournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<TTournament | null>(null);
  const currentTournamentRef = useRef<TTournament | null>(null);
  const [justDropped, setJustDropped] = useState(null);

  const params = useParams();

  const { isSignedIn, user } = useUser();
  // console.log(user, "user");
  // console.log("in the context", currentTournament);
  const tournamentOwner = isSignedIn && user.id === currentTournament?.adminUser;

  useEffect(() => {
    currentTournamentRef.current = currentTournament;
  }, [currentTournament]);

  // gets+sets all tournaments
  useEffect(() => {
    fetchTournaments();
  }, []);

  // gets+sets both the tournament and its players | Sync Current Tournament with URL Pathname
  useEffect(() => {
    const tournamentId = Array.isArray(params.id) ? params.id[0] : null;

    if (!tournamentId) {
      console.warn("⚠️ No tournament ID found in URL.");
      return;
    }

    fetchTournament(tournamentId);
  }, [params?.id]); // runs when `pathname` changes

  // gets a single tournament directly from the API
  const fetchTournament = async (tournamentId: string) => {
    try {
      // console.log("Fetching tournament:", tournamentId);
      const response = await fetch(`/api/tournament/${tournamentId}`);

      if (!response.ok) {
        setCurrentTournament(null);
        throw new Error(`Error fetching tournament: ${response.statusText}`);
      }

      const tournamentData = await response.json();
      // console.log("Tournament fetched:", tournamentData);
      setCurrentTournament(tournamentData);
    } catch (error) {
      console.error("Failed to fetch tournament:", error);
    }
  };

  const filteredTournaments = tournaments.filter((tournament) => tournament.adminUser === user?.id);

  //WORKS: as expected gets ALL tournaments
  const fetchTournaments = async () => {
    const response = await fetch(`/api/tournament/`);
    const tournamentsData = await response.json();
    // console.log("response: ", tournamentsData);
    setTournaments(tournamentsData);
  };

  //WORKS: Derived Categories from Players for one tournament
  const uniqueCategories = useMemo(() => {
    const categories = tournaments.flatMap((tournament) => tournament.categories || []);
    return Array.from(new Set(categories));
  }, [tournaments]);

  // console.log("in the context ", uniqueCategories);

  return (
    <TournamentsAndQueuesContext.Provider
      value={{
        draggedItem,
        setDraggedItem,
        uniqueCategories,
        currentTournament,
        setCurrentTournament,
        currentTournamentRef,
        tournamentOwner,
        tournaments,
        setTournaments,
        filteredTournaments,
        fetchTournaments,
        justDropped,
        setJustDropped,
      }}
    >
      {children}
    </TournamentsAndQueuesContext.Provider>
  );
};

export const useTournamentsAndQueuesContext = (): TTournamentsAndQueuesContextProps => {
  const context = useContext(TournamentsAndQueuesContext);
  if (!context) {
    throw new Error(
      "useTournamentsAndQueuesContext must be used within a TournamentsAndQueuesProvider"
    );
  }
  return context;
};

// OLD: functions group that WORKS: but we don't use them anymore
/* to get the newest players after one is added
  const fetchNewPlayers = async (tournamentId: string) => {
    try {
      const response = await fetch(`/api/tournament/${tournamentId}`);
      const playersData = await response.json();

      const playersForTournament = playersData.filter(
        (player: TPlayer) => player.tournamentId === tournamentId
      );

      console.log("Fetched Players: ", playersForTournament);

      setCurrentTournament((prevTournament: TTournament | null) =>
        prevTournament
          ? { ...prevTournament, unprocessedPlayers: playersForTournament }
          : prevTournament
      );
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

    // Doesn't work: planned to use it | swapped to socket
  const saveTournament = async (tournamentId: string) => {
    // comes through OK
    // console.log(tournamentId);
    console.log("BEFORE TRY: ", currentTournament);

    try {
      const res = await fetch(`/api/tournaments/${tournamentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentTournament),
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
  //IMPORTANT: WORKS: & now exists as socket
  const addPlayerToTournament = (playerData: TPlayer): void => {
    // console.log("addPlayerToTournament RAN");
    // console.log("CURRENT TOURNAMENT IN ADDPLAYERFROMSOCKET", currentTournament);
    // console.log("currentTournamentREF.current:", currentTournamentRef.current);

    if (currentTournamentRef.current) {
      setCurrentTournament((prevTournament: TTournament | null) => {
        // console.log("PREV TOURNAMENT")
        // console.log(prevTournament)
        if (!prevTournament) return prevTournament;
        // console.log("SETTING THE TOURNAMENT");
        return {
          ...prevTournament, //spreads the tournament
          unProcessedQItems: [...prevTournament.unProcessedQItems, playerData], // appends the arr with playerData
        };
      });
    }
  };

    //WORKS: Adds Queues
  const addMoreQueues = () => {
    const newQueue = {
      queueName: (currentTournament?.queues.length + 1).toString(),
      queueItems: [],
      id: currentTournament?.queues.length.toString(),
    };

    setCurrentTournament((prevTournament: TTournament | null) => {
      if (!prevTournament) return prevTournament;
      return {
        ...prevTournament,
        queues: [...prevTournament?.queues, newQueue],
      };
    });
  };

  //WORKS: Removes Queues
  const removeQueues = () => {
    setCurrentTournament((prevTournament: TTournament | null) => {
      if (!prevTournament) return prevTournament;
      return {
        ...prevTournament,
        queues: prevTournament.queues.slice(0, -1),
      };
    });
  };
 */
