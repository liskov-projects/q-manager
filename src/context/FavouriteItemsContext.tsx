"use client";
// hooks
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
// types
import { TPlayer, TUser, TFavouriteItemsContext } from "@/types/Types";
import { ClerkUser } from "@clerk/types";

const FavouriteItemsContext = createContext<TFavouriteItemsContext | null>(null);

export function FavouriteItemsProvider({ children }: { children: React.ReactNode }) {
  const [appUser, setAppUser] = useState<TUser>(null);

  const [favouritePlayers, setFavouritePlayers] = useState<TPlayer[]>([]);
  const [favouriteTournaments, setFavouriteTournaments] = useState<TPlayer[]>([]);

  const { user, isSignedIn, isLoaded } = useUser();

  // console.log("User is", user);

  useEffect(() => {
    if (user?.id && isSignedIn && isLoaded) getAppUserFromDB(user.id);
  }, [isSignedIn, isLoaded, user]);

  // useEffect(() => {
  //   if (appUser) {
  //     setFavouritePlayers(appUser.favouritePlayers || []);
  //     setFavouriteTournaments(appUser.favouriteTournaments || []);
  //   }
  // }, [appUser]);

  //FIXME: as expected at /all-tounaments | resets when user-settings refreshed
  // console.log("appUser in CONTEXT", appUser);
  // console.log("fav tourn", favouriteTournaments);

  const addUser = async (user: ClerkUser) => {
    const { id, username } = user;
    const phoneNumber = "add the number to recieve notifications";
    try {
      console.log("Sending request to backend...");
      const response = await fetch(`/api/user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, username, phoneNumber }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("fetch POST result: ", data);

      if (response.ok) {
        console.info("user added");
      } else if (response.status === 409) {
        const data = getAppUserFromDB(id);
        setAppUser(data);
      }
    } catch (err) {
      throw new Error("error adding a new user", err);
    }
  };

  const getAppUserFromDB = async (userId: string) => {
    console.log("getAppUserFromDB triggered in USERSETPAGE");
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Data from backend:", data);

      setAppUser(data); // Update state
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  //FIXME: Log when appUser updates \ DELETE:
  useEffect(() => {
    if (appUser) {
      console.log("APP USER updated in context:", appUser);
    }
  }, [appUser]);
//

  const getFavouritePlayers = async () => {
    try {
      // console.log("Sending request to backend...");
      const response = await fetch("/api/favouritePlayers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      // console.log("Response status:", response.status);
      const data = await response.json();
      // console.log("fetch GET result: ", data);

      if (response.ok) {
        setFavouritePlayers(data);
      }
    } catch (error) {
      console.error("Error in toggleFavouritePlayers:", error);
    }
  };

  const addPlayerToFavourites = async (playerId: string) => {
    try {
      // console.log("Sending request to backend...");
      const response = await fetch("/api/favouritePlayers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("fetch POST result: ", data);

      if (response.ok) {
        getFavouritePlayers();
      }
    } catch (error) {
      console.error("Error in toggleFavouritePlayers:", error);
    }
  };

  const removeFavouritePlayer = async (playerId: string) => {
    // console.log(playerId, "in remove fav player");
    try {
      // console.log("Sending request to backend...");
      const response = await fetch("/api/favouritePlayers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("fetch DELETE result: ", data);

      if (response.ok) {
        getFavouritePlayers();
      }
    } catch (error) {
      console.error("Error in toggleFavouritePlayers:", error);
    }
  };

  const getFavouriteTournaments = async () => {
    try {
      // console.log("Sending request to backend...");
      const response = await fetch("/api/favouriteTournaments", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      // console.log("Response status:", response.status);
      // console.log("RESPONSE");
      // console.log(response);
      const data = await response.json();
      // console.log("fetch GET result: ", data);

      if (response.ok) {
        setFavouriteTournaments(data);
      }
    } catch (error) {
      console.error("Error in getFavouriteTournaments:", error);
    }
  };

  const addTournamentToFavourites = async (tournamentId: string) => {
    try {
      // console.log("Sending request to backend...");
      const response = await fetch("/api/favouriteTournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("fetch POST result: ", data);

      if (response.ok) {
        console.log("response ok remember to call getFavTourn here!!");
        getFavouriteTournaments();
      }
    } catch (error) {
      console.error("Error in addTournamentToFavourites:", error);
    }
  };

  const removeFavouriteTournament = async (tournamentId: string) => {
    console.log(tournamentId, "in remove fav player");
    try {
      console.log("Sending request to backend...");
      const response = await fetch("/api/favouriteTournaments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      // console.log("fetch DELETE result: ", data);

      if (response.ok) {
        getFavouriteTournaments();
      }
    } catch (error) {
      console.error("Error in removeFavouriteTournament:", error);
    }
  };

  //   console.log("fav players: ", favouritePlayers);
  // console.log("fav TOURNAMENTS: ", favouriteTournaments);

  return (
    <FavouriteItemsContext.Provider
      value={{
        favouritePlayers,
        setFavouritePlayers,
        addPlayerToFavourites,
        removeFavouritePlayer,
        getFavouritePlayers,
        favouriteTournaments,
        setFavouriteTournaments,
        addTournamentToFavourites,
        getFavouriteTournaments,
        removeFavouriteTournament,
        // getAppUserFromDB,
        appUser,
        setAppUser,
        addUser,
      }}
    >
      {children}
    </FavouriteItemsContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouriteItemsContext);
  if (!context) {
    throw new Error("useFavourites must be defined");
  }
  return context;
}
