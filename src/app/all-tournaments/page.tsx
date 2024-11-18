import Tournament from "@/components/Tournaments/Tournament";
// FIXME: dev purposes
import mockTournaments from "@/Data/tournaments";

export default function AllTournaments() {
  // FIXME: for dev purposes
  // const numOfTournaments = [1, 2, 3, 4, 4, 5, 6, 7, 8, 12];

  return (
    // FIXME: the grid for both sections
    <div className="flex flex-row items-center justify-around">
      <div className="flex flex-col">
        <span>Tournaments Grid goes here</span>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockTournaments.map((tournamnet, ind) => (
            <Tournament key={ind} tournament={tournamnet} />
          ))}
        </ul>
      </div>
      <div className="flex flex-col">
        <span>Side bar with search filed</span>
        <input type="text" />
      </div>
    </div>
  );
}
