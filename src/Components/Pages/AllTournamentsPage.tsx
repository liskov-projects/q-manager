"use client";

import { useState } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { TTournament } from "@/types/Types";
import SectionHeader from "@/Components/SectionHeader";
import Button from "@/Components/Buttons/Button";
import TournamentCard from "@/Components/Tournaments/TournamentCard";
import NewTournamentForm from "@/Components/Forms/NewTournamentForm";
import { AnimatePresence, motion } from "framer-motion";

export default function AllTournamentsPage() {
  const { tournaments } = useTournamentsAndQueuesContext();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const tournamentsToShow = tournaments
    .filter((tournament: TTournament) => {
      const searchLower = search.toLowerCase();
      return (
        search.length === 0 ||
        tournament.name.toLowerCase().includes(searchLower) ||
        tournament.description.toLowerCase().includes(searchLower) ||
        tournament.categories.some((category: string) =>
          category.toLowerCase().includes(searchLower)
        )
      );
    })
    .sort((a: TTournament, b: TTournament) => a.name.localeCompare(b.name));

  return (
    <div className="p-4 w-full flex flex-col lg:flex-row gap-4">
      {/* Small/medium: search and toggle button above list */}
      <div className="block lg:hidden order-1 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2">
          <input
            className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 w-full sm:w-[60%]"
            type="text"
            placeholder="Search tournaments"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Hide Form" : "New Tournament"}
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
      <div className="flex-1 order-2 lg:order-1">
        <div className="flex items-center justify-between mb-2">
          <SectionHeader>Tournaments</SectionHeader>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tournamentsToShow.map((tournament: TTournament, index: number) => (
            <TournamentCard key={index} tournament={tournament} />
          ))}
        </ul>
      </div>

      {/* Sidebar for large screens only */}
      <div className="hidden lg:flex w-full lg:w-[25%] flex-col gap-4 order-3">
        <SectionHeader>Tournament functions</SectionHeader>

        <div className="shadow-left-bottom-lg flex flex-col items-start p-4 rounded-md">
          <SectionHeader>Search tournaments:</SectionHeader>
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
  );
}
