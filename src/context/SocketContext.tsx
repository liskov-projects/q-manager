"use client";
import { toast } from "sonner";
import { createContext, useContext, useEffect, ReactNode, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useTournamentsAndQueuesContext } from "./TournamentsAndQueuesContext";
import { useFavourites } from "./FavouriteItemsContext";
import useDragNDrop from "@/hooks/useDragNDrop";
import { TPlayer } from "@/types/Types";
import Button from "@/Components/Buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaCross } from "react-icons/fa";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (process.env.NEXT_PUBLIC_PORT
    ? `http://localhost:${process.env.NEXT_PUBLIC_PORT}`
    : "http://localhost:4000");

console.log("SOCKET URL");
console.log(SOCKET_URL);

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { setCurrentTournament } = useTournamentsAndQueuesContext();
  const { handleDrop } = useDragNDrop();
  const { favouritePlayers } = useFavourites();

  // ✅ Create stable refs to avoid dependency issues
  const setCurrentTournamentRef = useRef(setCurrentTournament);
  setCurrentTournamentRef.current = setCurrentTournament;

  const favouritePlayersRef = useRef(favouritePlayers);
  favouritePlayersRef.current = favouritePlayers;

  const handleDropRef = useRef(handleDrop);
  handleDropRef.current = handleDrop;

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance); //Save socket instance in state

    console.log("🔌 Connecting to WebSocket...");

    // Attach event listeners immediately
    socketInstance.on("connect", () => {
      console.log("✅ WebSocket Connected, Socket ID:", socketInstance.id);
    });

    socketInstance.on("playerAdded", ({ updatedTournament }) => {
      // console.log("PLAYER ADDED BY WEBSOCKET:", playerData);
      // console.log(message)
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("addPlayer failed in context", error.message);
        } else {
          console.error("addPlayer failed in context", error);
        }
      }
    });

    socketInstance.on("deletePlayer", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("deletePlayer failed in context", error.message);
        } else {
          console.error("deletePlayer failed in context", error);
        }
      }
    });

    socketInstance.on("editPlayer", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("editPlayer failed in context", error.message);
        } else {
          console.error("editPlayer failed in context", error);
        }
      }
    });
    //
    socketInstance.on("playerDropped", ({ draggedItem, index, dropTarget }) => {
      // console.log("PLAYER DROPPED");
      // console.log(draggedItem);
      // console.log(index);
      // console.log(dropTarget);

      try {
        const queueToSplice = handleDropRef.current(draggedItem, index, dropTarget);

        const isFavourite = favouritePlayersRef.current.some(
          (fav: TPlayer) => fav._id === draggedItem._id
        );

        if (isFavourite) {
          let message;
          if (queueToSplice?.queueName) {
            message = (
              <span className="ml-8">
                {draggedItem.names} added to {queueToSplice?.queueName} at position {index}
              </span>
            );
          } else if (dropTarget === "unprocessed") {
            return;
          } else {
            message = (
              <span className="ml-8">{draggedItem.names} finished playing for the day</span>
            );
          }
          // toast(`Added ${draggedItem.names || "player"} to ${queueName}`);
          toast.custom((t) => (
            <div className="bg-bluestone-200 rounded text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between w-full max-w-sm">
              <Button
                onClick={() => toast.dismiss(t)}
                className={` hover:tennis-200 px-2 py-3 w-6 h-6 flex items-center self-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-200 transition`}
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faClose} />
              </Button>
              {message}
            </div>
          ));
        } else {
          console.log("Player is not a favourite.");
        }

        // setCurrentTournament(updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("playerDropped failed in context", error.message);
        } else {
          console.error("playerDropped failed in context", error);
        }
      }
    });

    socketInstance.on("addPlayerToShortestQ", ({ playerData, updatedTournament }) => {
      console.log(playerData);
      try {
        setCurrentTournamentRef.current(updatedTournament);
        // handleAddToShortestQueue(playerData, updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("addPlayerToShortestQ failed in context", error.message);
        } else {
          console.error("addPlayerToShortestQ failed in context", error);
        }
      }
    });

    socketInstance.on("addAllPlayersToQueues", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("addAllPlayersToQueues failed in context", error.message);
        } else {
          console.error("addAllPlayersToQueues failed in context", error);
        }
      }
    });

    // NEW:
    socketInstance.on("addAllFromOneList", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("addAllFromOneList failed in context", error.message);
        } else {
          console.error("addAllFromOneList failed in context", error);
        }
      }
    });

    ///
    socketInstance.on("uprocessAllPlayers", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("uprocessAllPlayers failed in context", error.message);
        } else {
          console.error("uprocessAllPlayers failed in context", error);
        }
      }
    });

    socketInstance.on("processAllPlayers", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("processAllPlayers failed in context", error.message);
        } else {
          console.error("processAllPlayers failed in context", error);
        }
      }
    });

    socketInstance.on("redistributePlayers", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("redistributePlayers failed in context", error.message);
        } else {
          console.error("redistributePlayers failed in context", error);
        }
      }
    });

    socketInstance.on("processQueueOneStep", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("processQueueOneStep failed in context", error.message);
        } else {
          console.error("processQueueOneStep failed in context", error);
        }
      }
    });

    socketInstance.on("addQueue", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("addQueue failed in context", error.message);
        } else {
          console.error("addQueue failed in context", error);
        }
      }
    });

    socketInstance.on("deleteQueue", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        if (error instanceof Error) {
          console.error("deleteQueue failed in context", error.message);
        } else {
          console.error("deleteQueue failed in context", error);
        }
      }
    });

    return () => {
      console.log("🔌 Cleaning up WebSocket listeners...");
      socketInstance.off("connect");
      socketInstance.off("playerAdded");
      socketInstance.off("deletePlayer");
      socketInstance.off("editPlayer");
      socketInstance.off("addPlayerToShortestQ");
      socketInstance.off("addAllPlayersToQueues");
      socketInstance.off("uprocessAllPlayers");
      socketInstance.off("processAllPlayers");
      socketInstance.off("processQueueOneStep");
      socketInstance.off("addQueue");
      socketInstance.off("deleteQueue");
      socketInstance.off("playerDropped");
      socketInstance.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
