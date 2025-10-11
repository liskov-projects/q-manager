"use client";

import { useState, useEffect } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { TTournament } from "@/types/Types";
import SectionHeader from "@/Components/SectionHeader";
import Button from "@/Components/Buttons/Button";
import TournamentCard from "@/Components/Tournaments/TournamentCard";
import NewTournamentForm from "@/Components/Forms/NewTournamentForm";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../Header";
import { useUser } from "@clerk/nextjs";
import { useFavourites } from "@/context/FavouriteItemsContext";

export default function AllTournamentsPage() {
  const { tournaments, allPlayers } = useTournamentsAndQueuesContext();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { isSignedIn, user } = useUser();
  const { appUser, favouriteTournaments, setAppUser, setFavouriteTournaments } = useFavourites();

  useEffect(() => {
    if (!isSignedIn) {
      setAppUser(null);
      setFavouriteTournaments([]);
    }
  }, [isSignedIn]);

  const tournamentsToShow = tournaments
    .filter((tournament: TTournament) => {
      const searchLower = search.toLowerCase();

      const foundTournament =
        tournament.name.toLowerCase().includes(searchLower) ||
        tournament.description.toLowerCase().includes(searchLower) ||
        tournament.categories.some((category: string) =>
          category.toLowerCase().includes(searchLower)
        );

      return search.length === 0 || foundTournament;
    })
    .sort((a: TTournament, b: TTournament) => a.name.localeCompare(b.name));

  const managedTournaments = tournamentsToShow.filter(
    (t: TTournament) => t.adminUser === appUser?.clerkId
  );

  return (
    <>
      <Header>Queue Manager</Header>
      <div className="p-4 w-full mt-10 flex flex-col lg:flex-row gap-3">
        {/* Small/medium: search and toggle button above list */}
        <div className="block lg:hidden mb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2">
            <input
              className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 w-full sm:w-[60%]"
              type="text"
              placeholder="Search tournaments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              className="border-bluestone-200 border-2 py-2 px-3 rounded-sm text-bluestone-300"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? "Hide Form" : "Add New Tournament"}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {showForm && (
              <motion.div
                key="form"
                initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotate: 3 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="shadow-left-bottom-lg p-4 rounded-md max-w-md mx-auto"
              >
                <NewTournamentForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tournaments section */}
        <div className="flex flex-col lg:w-3/4">
          {managedTournaments.length > 0 ? (
            <div className="flex-1 order-2 lg:order-1">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader>Managed Tournaments</SectionHeader>
              </div>

              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {managedTournaments.map((tournament: TTournament, index: number) => (
                  <TournamentCard key={index} tournament={tournament} />
                ))}
              </ul>
            </div>
          ) : null}
          {favouriteTournaments.length > 0 ? (
            <div className="flex-1 order-2 lg:order-1">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader>Favourite Tournaments</SectionHeader>
              </div>

              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {favouriteTournaments.map((tournament: TTournament, index: number) => (
                  <TournamentCard key={index} tournament={tournament} />
                ))}
              </ul>
            </div>
          ) : null}
          <div className="flex-1 order-2 lg:order-1">
            <div className="flex items-center justify-between mb-4 mt-4">
              <SectionHeader>All Tournaments</SectionHeader>
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tournamentsToShow.map((tournament: TTournament, index: number) => (
                <TournamentCard key={index} tournament={tournament} />
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar for large screens only */}
        <div className="hidden lg:flex lg:w-1/4 flex-col gap-4 order-3">
          {/* <SectionHeader>Tournament functions</SectionHeader>  */}

          <div className="shadow-left-bottom-lg flex flex-col mt-11 items-start p-4 rounded-md">
            <SectionHeader>Search Tournaments:</SectionHeader>
            <input
              className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 mt-2 w-full"
              type="text"
              placeholder="Search for players, tournaments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="shadow-left-bottom-lg p-4 rounded-md">
            <NewTournamentForm />
          </div>
        </div>
      </div>
    </>
  );
}
