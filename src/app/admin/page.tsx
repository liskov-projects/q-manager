"use client";
import NewPlayerForm from "@/Components/Forms/NewPlayerForm";
import NewQueueForm from "@/Components/Forms/NewQueueForm";
import NewTournamentForm from "@/Components/Forms/NewTournamentForm";

export default function AdminPage() {
  return (
    <div className="flex flex-col">
      <NewTournamentForm />
      <NewQueueForm />
      <NewPlayerForm />
    </div>
  );
}
