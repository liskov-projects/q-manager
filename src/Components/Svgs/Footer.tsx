// components
import LiskovLogo from "./LiskovLogo";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex flex-row mt-4 justify-around items-center w-full p-4 bg-shell-75">
      <div className=" flex flex-row  text-bluestone-200 gap-[100%]">
        <ul className="text-xl flex flex-col">
          <li className="font-bold">Contact us:</li>
          <li>email: info@liskov.dev</li>
          <Link
            target="_blank"
            href="https://www.linkedin.com/company/96348690/"
            className="underline hover:text-brick-100 hover:underline"
          >
            linkedIn
          </Link>
        </ul>
        <ul className="text-xl flex flex-col">
          <li className="font-bold">
            <Link
              target="_blank"
              href="https://forms.gle/pdds83kUdZfK1haDA"
              className="hover:text-brick-100 hover:underline"
            >
              Help us improve
            </Link>
          </li>
        </ul>
      </div>

      <div className="w-16 sm:w-20">
        <LiskovLogo className="text-bluestone-200" />
      </div>
    </div>
  );
}
