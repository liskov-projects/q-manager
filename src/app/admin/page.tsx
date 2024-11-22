import NewPlayerForm from "@/components/Forms/NewPlayerForm";
import NewTournamentForm from "@/components/Forms/NewTournamentForm";

export default function AdminPage() {
  return (
        <div className="flex flex-col">
          <NewTournamentForm />
          <span>Browse Tournaments</span>
          <NewPlayerForm />
        </div>
  );
}
