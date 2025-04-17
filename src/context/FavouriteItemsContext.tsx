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

  const [favouritePlayers, setFavouritePlayers] = useState<string[]>([]);
  const [favouriteTournaments, setFavouriteTournaments] = useState<string[]>([]);

  const { user, isSignedIn, isLoaded } = useUser();

  //  waits for the user from Clerk to do a db request
  useEffect(() => {
    const syncAppUser = async () => {
      // console.log("IN THE USER SYNC");
      if (user?.id && isSignedIn && isLoaded) {
        try {
          // console.log("ATTEMPTING DB PULL");
          const response = await getAppUserFromDB(user.id);

          if (response.status === 404) {
            // Not found, try to create
            const newUser = await addUser(user);
            // console.log("GOT NEW USER?");
            // console.log(newUser);
            if (newUser) {
              setAppUser(newUser);
            }
          } else if (response.ok) {
            const existingUser = await response.json();
            // console.log("GOT EXISTING USER?");
            // console.log(existingUser);
            setAppUser(existingUser);
          } else {
            console.error("Unexpected error fetching user:", response.status);
          }
        } catch (err) {
          console.error("Error syncing app user:", err);
        }
      }
    };

    syncAppUser();
  }, [user?.id, isSignedIn, isLoaded]);

  useEffect(() => {
    if (isSignedIn) {
      getFavouritePlayers();
      getFavouriteTournaments();
    }
  }, [appUser]);

  const addUser = async (user: ClerkUser): Promise<TUser | null> => {
    if (!user) return null;

    const { id: clerkId, emailAddress } = user;

    // Define a username with fallback priority
    const username =
      user.username || user.firstName || user.emailAddresses?.[0]?.emailAddress || "Unnamed User";

    const usedFallback =
      !user.username && !user.firstName && !user.emailAddresses?.[0]?.emailAddress;

    console.log("👤 Sending user to API:", {
      clerkId,
      username,
      usedFallback,
      emailAddress,
    });

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId, username, usedFallback, emailAddress }),
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        console.warn("Failed to create user:", data);
        return null;
      }
    } catch (err) {
      console.error("Error adding new user:", err);
      return null;
    }
  };

  const getAppUserFromDB = async (userId: string): Promise<Response> => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response; // leave it to caller to handle response.ok etc
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  };

  const getFavouritePlayers = async () => {
    try {
      // console.log("Sending request to backend...");
      const response = await fetch("/api/favouritePlayers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      // console.log("Response status:", response.status);
      const data = await response.json();
      // console.log("fetch GET fav players result: ", data);

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
        getAppUserFromDB,
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
