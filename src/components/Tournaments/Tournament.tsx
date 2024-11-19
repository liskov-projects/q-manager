import Image from "next/image";
import TournamentType from "@/types/Tournament";
import Link from "next/link";
import SectionHeader from "../SectionHeader";

export default function Tournament({tournament}: {tournament: TournamentType}) {
  const {name, categories, description} = tournament;
  // console.log(name, categories, description);
  const formattedCategories = categories.join(", ");

  return (
    <div className="flex flex-col items-center">
      <SectionHeader>
        <Link href={`/all-tournaments/${name}`}>{name}</Link>
      </SectionHeader>

      <Image
        //   FIXME:
        src="/tennis.jpg"
        alt={`Tournament ${name} Image`}
        width={350}
        height={250}
      />
      <p>{description}</p>
      <br />
      <p>{formattedCategories}</p>
    </div>
  );
}
