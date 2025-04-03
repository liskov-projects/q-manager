// hooks
import { useFavourites } from "@/context/FavouriteItemsContext";
import { TPlayer, TTournament } from "@/types/Types.js";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation.js";
import { useUser } from "@clerk/nextjs";

export default function StarItem({
  playerId,
  tournamentId,
}: {
  playerId?: string;
  tournamentId?: string;
}) {
  const [isStarred, setIsStarred] = useState(false);
  const {
    addPlayerToFavourites,
    removeFavouritePlayer,
    favouritePlayers,
    getFavouritePlayers,
    addTournamentToFavourites,
    favouriteTournaments,
    getFavouriteTournaments,
    removeFavouriteTournament,
  } = useFavourites();
  const { isSignedIn } = useUser();
  // // makes sure we have yellow stars when a page loads
  // useEffect(() => {
  //   getFavouritePlayers();
  //   getFavouriteTournaments();
  // }, []);

  // responsible for setting stars yellow on the favs page
  useEffect(() => {
    if (playerId) setIsStarred(favouritePlayers.some((player: TPlayer) => player._id === playerId));
    if (tournamentId)
      setIsStarred(
        favouriteTournaments.some((tournament: TTournament) => tournament._id === tournamentId)
      );
  }, [favouritePlayers, favouriteTournaments]);

  // works based off the parameter passed into the component player/tournamentId
  const handleClick = (e) => {
    e.stopPropagation();

    if (playerId) {
      console.log("playerId in Star", playerId);
      if (!isStarred) addPlayerToFavourites(playerId);
      if (isStarred) removeFavouritePlayer(playerId);
      // setIsStarred(!isStarred);
    } else if (tournamentId) {
      e.stopPropagation();
      if (!isStarred) addTournamentToFavourites(tournamentId);
      if (isStarred) removeFavouriteTournament(tournamentId);
      // setIsStarred(!isStarred);
    }
  };

  // not showing the star if the user is not signed in
  if (!isSignedIn) return null;
  return (
    <span className="w-8 h-8 block cursor-pointer" role="button" onClick={(e) => handleClick(e)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill={!isStarred ? "#e7e0ca" : "#EEFC72"}
        stroke={!isStarred ? "#F45B26" : "#D0E323"}
        className="transition-colors duration-200 hover:fill-tennis-50 hover:stroke-tennis-200"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </span>
  );
}
