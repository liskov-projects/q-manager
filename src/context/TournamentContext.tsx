"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {useUser} from "@clerk/nextjs";
import {useQueuesContext} from "./QueuesContext";
import TournamentType from "@/types/Tournament";

interface TournamentContextProps {
  currentTournament?: TournamentType;
  tournaments: TournamentType[];
  setCurrentTournament: React.Dispatch<
    React.SetStateAction<TournamentType | undefined>
  >;
  setTournaments: React.Dispatch<React.SetStateAction<TournamentType[]>>;
  filteredTournaments: TournamentType[];
  fetchTournaments: () => Promise<void>;
}

const TournamentContext = createContext<TournamentContextProps | undefined>(
  undefined
);

export const TournamentProvider: React.FC<{children: React.ReactNode}> = ({
  children
}) => {
  const [tournaments, setTournaments] = useState<TournamentType[]>([]);
  const [currentTournament, setCurrentTournament] = useState<TournamentType>();
  const pathname = usePathname();
  const {user} = useUser();
  const {players} = useQueuesContext();

  const filteredTournaments = tournaments.filter(
    tournament => tournament.adminUser === user?.id
  );

  //   console.log(pathname);
  const segments = pathname.split("/");
  const name = segments.pop();
  //   console.log(name);

  useEffect(() => {
    if (name && tournaments.length > 0) {
      const foundTournament = tournaments.find(
        tournament => tournament.name === name
      );
      if (foundTournament) {
        setCurrentTournament(foundTournament);
      }
    }
  }, [name, tournaments]);

  //   console.log("this is the current ", currentTournament);

  const fetchTournaments = async () => {
    // the path to tournaments route
    const response = await fetch("../api/tournaments/");
    const tournaments = await response.json();
    // console.log("works");
    setTournaments(tournaments);
  };

  //FIXME: how to make it show up in the dropdown without reload? || fetching from db is an effect
  useEffect(() => {
    fetchTournaments();
    // console.log(tournaments);
  }, [players]);

  return (
    <TournamentContext.Provider
      value={{
        currentTournament,
        tournaments,
        setCurrentTournament,
        setTournaments,
        filteredTournaments,
        fetchTournaments
      }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournamentContext = (): TournamentContextProps => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournamentContext must be used within a TournamentProvider");
  }
  return context;
};
