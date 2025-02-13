import Link from "next/link";

export default function BackToAllTournamentsLink() {
  return (
    <Link
      href="/all-tournaments"
      className="self-center ml-2 text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] p-2 hover:bg-bluestone-200 hover:text-shell-100"
    >
      Back to all tournaments
    </Link>
  );
}
