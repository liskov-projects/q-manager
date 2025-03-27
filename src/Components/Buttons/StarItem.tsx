// hooks
import { useFavourites } from "@/context/FavouritePlayersContext";
import { usePathname } from "next/navigation.js";
import { useState, useEffect } from "react";

export default function StarItem({ playerId }: { playerId: string }) {
  const { favouritePlayers, toggleFavouritePlayers } = useFavourites();
  // const isStarred = favouritePlayers.includes(playerId);
  const [isStarred, setIsStarred] = useState(false);
  const pathname = usePathname();
  console.log("pathname", pathname);

  useEffect(() => {
    if (pathname.includes("/user-settings")) {
      setIsStarred(true);
    }
  }, [pathname]);

  const handleClick = () => {
    toggleFavouritePlayers(playerId);
    setIsStarred(!isStarred);
  };
  return (
    <span className="w-12 h-12 block cursor-pointer" role="button" onClick={handleClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill={!isStarred ? "#e7e0ca" : "#EEFC72"}
        stroke={!isStarred ? "#F45B26" : "#D0E323"}
        className="transition-colors duration-200 hover:fill-tennis-50 hover:stroke-tennis-200"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {/* {isStarred ? starred : notStarred} */}
    </span>
  );
}
