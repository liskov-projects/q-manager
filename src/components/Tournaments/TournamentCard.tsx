import Image from "next/image";
import {TTournament} from "@/types/Types";
import Link from "next/link";
import SectionHeader from "../SectionHeader";
import TournamentCategories from "./TournamentCategories";

export default function Tournament({tournament}: {tournament: TTournament}) {
  const {name, _id, description, categories} = tournament;
  // comes through
  // console.log(categories);

  return (
    <div className="flex flex-col items-center">
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
        <span className="mt-2 mb-4 text-ml text-gray-600 italic">{description}</span>
        <TournamentCategories categories={categories} />
      </Link>
    </div>
  );
}
