import Image from "next/image";
import TournamentType from "@/types/Tournament";
import Link from "next/link";
import SectionHeader from "../SectionHeader";

export default function Tournament({tournament}: {tournament: TournamentType}) {
  const {_id, name, categories, description} = tournament;
  // console.log(name, categories, description);
  return (
    <div>
      <SectionHeader>
        <Link href={`/all-tournaments/${_id}`}>{name}</Link>
      </SectionHeader>

      <Image
        //   FIXME:
        src="/tennis.jpg" // Replace with your image path
        alt={`Tournament ${name} Image`} // A meaningful alt text for accessibility
        width={500} // Set the width of the image
        height={300} // Set the height of the image
      />
      <span>{description}</span>
      <br />
      <span>{categories?.join(", ")}</span>
    </div>
  );
}
