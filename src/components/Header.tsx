"use client";
import User from "@/components/User";
// import Button from "./Buttons/Button";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Header() {
  const path = usePathname();

  const notHome = path !== "/all-tournaments";

  return (
    <div className="flex justify-between items-center py-2">
      <div>
        <div className="flex-shrink-0 w-16 h-16 ml-8">
          <svg
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full">
            <ellipse
              style={{fill: "none", strokeWidth: "5px", stroke: "rgb(227, 224, 224)"}}
              cx="240.788"
              cy="250.442"
              rx="164.268"
              ry="164.268"
            />
            <path
              d="M 98.67 366.873 L 98.67 144.885 L 162.095 144.885 L 162.095 335.16 L 288.945 335.16 L 288.945 366.873 Z"
              style={{fill: "rgb(107, 142, 35)"}}
            />
            <path
              d="M 366.291 284.523 L 366.291 238.898 L 411.916 238.898 L 411.916 284.523 Z M 343.479 375.773 L 343.479 352.96 L 366.291 352.96 L 366.291 307.335 L 411.916 307.335 L 411.916 352.96 L 389.104 352.96 L 389.104 375.773 Z"
              style={{fill: "rgb(107, 142, 35)"}}
            />
          </svg>
        </div>
        {notHome && (
          <Link
            href="/all-tournaments"
            className="self-center ml-2 text-l text-bluestone-200 border-2 border-bluestone-200 rounded-[5px] p-2 hover:bg-bluestone-200 hover:text-shell-100">
            Back to all tournaments
          </Link>
        )}
      </div>
      <h1 className="flex-grow text-3xl text-heading text-center">
        Queue Management
      </h1>
      <User />
    </div>
  );
}
