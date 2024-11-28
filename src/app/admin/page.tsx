"use client";
import NewPlayerForm from "@/components/Forms/NewPlayerForm";
import NewQueueForm from "@/components/Forms/NewQueueForm";
import NewTournamentForm from "@/components/Forms/NewTournamentForm";

export default function AdminPage() {
  return (
    <div className="flex flex-col">
      <NewTournamentForm />
      <NewQueueForm />
      <NewPlayerForm />
    </div>
  );
}
