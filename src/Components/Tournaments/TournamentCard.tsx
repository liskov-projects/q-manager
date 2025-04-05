"use client";
// hooks
import { useAuth } from "@clerk/nextjs";
// types
import { TTournament } from "@/types/Types";
// components
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "../SectionHeader";
// import TournamentCategories from "./TournamentCategories";
import StarItem from "../Buttons/StarItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";

export default function TournamentCard({ tournament }: { tournament: TTournament }) {
  const { name, _id, description, categories, adminUser } = tournament;
  const { userId } = useAuth(); //gets hold of the current user id to do the ckeck agai
  // console.log(userId);

  return (
    <div className="w-full flex flex-col items-center border border-gray-300 rounded-md p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 shadow-left-bottom-lg">
      {/* <Link
        href={`/all-tournaments/${_id}`}
        className="flex flex-col items-center w-full h-full cursor-pointer"
      > */}
      <div className="flex w-full cursor-pointer justify-between mb-2">
        <Link href={`/all-tournaments/${_id}`}>
          <SectionHeader className="flex items-center justify-center gap-x-2">
            {name}
            {adminUser === userId ? <FontAwesomeIcon icon={faWrench} /> : null}
          </SectionHeader>
        </Link>
        <StarItem tournamentId={tournament._id} />
      </div>

      {/* Image Container */}
      <div className="w-full h-[125px] relative">
        <Link href={`/all-tournaments/${_id}`}>
          <Image
            src={tournament.image}
            alt={`Tournament ${name} Image`}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover rounded-md"
          />
        </Link>
      </div>

      {/* Description & Categories */}
      <div className="flex-grow text-lg m-2 text-gray-600 font-semibold text-center">
        {description}
      </div>

      {/* <TournamentCategories categories={categories} tournamentId={_id} /> */}
      {/* </Link> */}
    </div>
  );
}
