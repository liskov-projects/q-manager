import Image from "next/image";
import {TTournament} from "@/types/Types";
import Link from "next/link";
import SectionHeader from "../SectionHeader";

export default function Tournament({tournament}: {tournament: TTournament}) {
  const {name, _id} = tournament;
  // console.log(name, categories, description);
  // const formattedCategories = categories.join(", ");

  return (
    <div className="flex flex-col items-center">
      <SectionHeader>
        <Link href={`/all-tournaments/${_id}`}>{name}</Link>
      </SectionHeader>

      <Image
        //   FIXME:
        src="/tennis.jpg"
        alt={`Tournament ${name} Image`}
        width={350}
        height={250}
      />
      <p>{_id}</p>
      {/* <p>{formattedCategories}</p> */}
    </div>
  );
}
