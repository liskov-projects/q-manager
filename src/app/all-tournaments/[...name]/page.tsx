import QueuesPage from "@/components/Pages/QueuesPage";

export default function TournamentPage({params}: {params: {_id: string}}) {
  return (
      <div>
        <h1 className="text-center text-2xl font-bold">
          Tournament name: {params._id}
        </h1>
        <QueuesPage />
      </div>
  );
}
