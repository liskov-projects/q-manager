import Image from "next/image";
import {TTournament} from "@/types/Types";
import Link from "next/link";
import SectionHeader from "../SectionHeader";
import TournamentCategories from "./TournamentCategories";

export default function TournamentCard({tournament}: {tournament: TTournament}) {
  const {name, _id, description, categories} = tournament;
  // comes through
  // console.log(categories);

  return (
    <div className="flex flex-col items-center border border-gray-300 shadow-md rounded-lg p-4 bg-shell-75 transition-all duration-300 hover:shadow-lg hover:-translate-y-4">
      <Link href={`/all-tournaments/${_id}`}>
        <SectionHeader>{name}</SectionHeader>

        <Image
          //   FIXME:
          src="/tennis.jpg"
          alt={`Tournament ${name} Image`}
          width={350}
          height={250}
        />
        {/* TODO: more styling here */}
        <div className="text-lg m-2 text-gray-600 font-semibold">{description}</div>
        <TournamentCategories categories={categories} />
      </Link>
    </div>
  );
}
