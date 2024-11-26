import QueuesPage from "@/components/Pages/QueuesPage";
import NewQueueForm from "@/components/Forms/NewQueueForm";

export default function TournamentPage({params}: {params: {_id: string}}) {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold">
        {/* TODO: change */}
        Tournament name: {params._id}
      </h1>
      <NewQueueForm />
      <QueuesPage />
    </div>
  );
}
