"use client";
import { useState, useEffect } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import TournamentQueuesPage from "@/Components/Pages/TournamentQueuesPage";
// import TournamentCategories from "@/Components/Tournaments/TournamentCategories";
import CategoryList from "@/Components/Tournaments/CategoryList";
import Image from "next/image";
import Header from "@/Components/Header";

export default function TournamentPage() {
  const { currentTournament } = useTournamentsAndQueuesContext();

  // console.log("CURRENT TOURNAMENT", currentTournament);

  const { name = "", categories = [] } = currentTournament || {};

  const [editedCategories, setEditedCategories] = useState([...categories]);

  useEffect(() => {
    setEditedCategories(categories);
  }, [categories]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Header and Category List */}
      <Header>{name}</Header>
      <CategoryList
        categories={categories}
        tournamentId={currentTournament?._id}
        editedCategories={editedCategories}
        setEditedCategories={setEditedCategories}
      />

      {/* Tournament Queues Page */}
      <TournamentQueuesPage tournamentId={currentTournament?._id} />
    </div>
  );
}
