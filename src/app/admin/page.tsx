"use client";

import NewTournamentForm from "@/components/Forms/NewTournamentForm";
import SectionHeader from "@/components/SectionHeader";

export default function AdminPage() {
  return (
    <div className="flex flex-col">
      <NewTournamentForm />
      <span>Browse Tournaments</span>
    </div>
  );
}
