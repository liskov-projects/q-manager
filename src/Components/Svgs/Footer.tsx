import LiskovLogo from "./LiskovLogo";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="h-auto flex flex-row justify-between items-center w-full p-4 bg-shell-75 mt-2">
      {/* Left Section */}
      <div className="flex flex-row items-center text-bluestone-200 gap-3 sm:gap-6 md:gap-12">
        {/* Contact Block */}
        <ul className="text-sm sm:text-base md:text-lg flex flex-col border-bluestone-200 border-2 px-2 py-1 rounded">
          <li className="font-bold">Contact us:</li>
          <li>email: info@liskov.dev</li>
          <Link
            target="_blank"
            href="https://www.linkedin.com/company/96348690/"
            className="underline hover:text-brick-100 hover:underline"
          >
            LinkedIn
          </Link>
        </ul>

        {/* Feedback Link */}
        <ul className="text-sm sm:text-base md:text-lg flex flex-col">
          <li className="font-bold border-bluestone-200 border-2 px-2 py-1 rounded-sm">
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

      {/* Logo Section */}
      <div className="flex-col items-center w-16 sm:w-16 mr-3">
        <LiskovLogo />
        <p className="text-sm sm:text-sm text-bluestone-200">Made by Liskov.Dev&copy;</p>
      </div>
    </div>
  );
}
