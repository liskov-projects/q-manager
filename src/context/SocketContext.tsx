"use client";

import { createContext, useContext, useEffect, ReactNode, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useTournamentsAndQueuesContext } from "./TournamentsAndQueuesContext";
import useDragNDrop from "@/hooks/useDragNDrop";

// const SOCKET_URL: string = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000/";
const SOCKET_URL: string =
  `http://localhost:${process.env.NEXT_PUBLIC_PORT}` || "http://localhost:4000/";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { setCurrentTournament } = useTournamentsAndQueuesContext();
  const { handleDrop } = useDragNDrop();

  // ✅ Create stable refs to avoid dependency issues
  const setCurrentTournamentRef = useRef(setCurrentTournament);
  setCurrentTournamentRef.current = setCurrentTournament;

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
        console.error("addPlayer failed in context", error.message);
      }
    });

    socketInstance.on("deletePlayer", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        console.error(error.message);
      }
    });

    socketInstance.on("editPlayer", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        console.error(error.message);
      }
    });
    //
    socketInstance.on("playerDropped", ({ draggedItem, index, dropTarget }) => {
      try {
        handleDropRef.current(draggedItem, index, dropTarget);
        // setCurrentTournament(updatedTournament);
      } catch (error) {
        console.error("handleDrop failed in context: ", error.message);
      }
    });

    socketInstance.on("addPlayerToShortestQ", ({ playerData, updatedTournament }) => {
      console.log(playerData);
      try {
        setCurrentTournamentRef.current(updatedTournament);
        // handleAddToShortestQueue(playerData, updatedTournament);
      } catch (error) {
        console.error("Failed to update tournament data", error.message);
      }
    });

    socketInstance.on("addAllPlayersToQueues", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        console.error("failed to add all players to queues", error.message);
      }
    });

    socketInstance.on("uprocessAllPlayers", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        console.error(error.message);
      }
    });

    socketInstance.on("processAllPlayers", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        console.error(error.message);
      }
    });

    socketInstance.on("processQueueOneStep", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        console.error(error.message);
      }
    });

    socketInstance.on("addQueue", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        console.error(error.message);
      }
    });

    socketInstance.on("deleteQueue", ({ updatedTournament }) => {
      try {
        setCurrentTournamentRef.current(updatedTournament);
      } catch (error) {
        console.error(error.message);
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
