import Image from "next/image";
import TournamentType from "@/types/Tournament";

// FIXME: types
export default function Tournament({tournament}: {tournament: TournamentType}) {
  const {name, categories, description} = tournament;
  console.log(name, categories, description);
  return (
    <div>
      <h1>{name}</h1>
      <Image
        //   FIXME:
        src="/path-to-your-image.jpg" // Replace with your image path
        alt={`Tournament ${name} Image`} // A meaningful alt text for accessibility
        width={500} // Set the width of the image
        height={300} // Set the height of the image
      />
      <span>{description}</span>
      <span>{categories}</span>
    </div>
  );
}
