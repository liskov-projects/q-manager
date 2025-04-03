import LiskovLogo from "./LiskovLogo";

export default function Footer() {
  return (
    <div className="flex flex-row mt-4 justify-around items-center w-full p-4 bg-shell-75">
      <div className=" flex flex-col  text-bluestone-200">
        <ul className="text-xl">
          <li className="font-bold">Contact us:</li>
          <li>email:</li>
          <li>linkedIn:</li>
          <li>Instagram:</li>
        </ul>
      </div>

      <div className="w-16 sm:w-20">
        <LiskovLogo />
      </div>
    </div>
  );
}
