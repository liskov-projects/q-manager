// types
import { TTournament } from "@/types/Types";
// components
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "../SectionHeader";
import TournamentCategories from "./TournamentCategories";
import StarItem from "../Buttons/StarItem";

export default function TournamentCard({ tournament }: { tournament: TTournament }) {
  const { name, _id, description, categories } = tournament;

  return (
    <div className="w-full min-h-[450px] flex flex-col items-center border border-gray-300 shadow-md rounded-lg p-4 bg-shell-75 transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
      <Link
        href={`/all-tournaments/${_id}`}
        className="flex flex-col items-center w-full h-full cursor-pointer"
      >
        <SectionHeader>{name}</SectionHeader>

        {/* Image Container */}
        <div className="w-full h-[250px] relative">
          <Image
            src="/tennis.jpg"
            alt={`Tournament ${name} Image`}
            fill
            className="object-cover rounded-md"
          />
        </div>

        {/* Description & Categories */}
        <div className="flex-grow text-lg m-2 text-gray-600 font-semibold text-center">
          {description}
        </div>

        <TournamentCategories categories={categories} tournamentId={_id} />
      </Link>
      <StarItem />
    </div>
  );
}
