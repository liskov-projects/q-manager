"use client";

import {createContext, useContext, useEffect, ReactNode, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useTournamentsAndQueuesContext} from "./TournamentsAndQueuesContext";
import useDragNDrop from "@/hooks/useDragNDrop";
import useAddToQueues from "@/hooks/useAddToQueues";

const SOCKET_URL: string =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000/";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({children}: {children: ReactNode}) => {
  const {addPlayerToTournament, setCurrentTournament} =
    useTournamentsAndQueuesContext();
  const {handleDrop} = useDragNDrop();
  const {handleAddToShortestQueue} = useAddToQueues();

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance); //Save socket instance in state

    console.log("🔌 Connecting to WebSocket...");

    // Attach event listeners immediately
    socketInstance.on("connect", () => {
      console.log("✅ WebSocket Connected, Socket ID:", socketInstance.id);
    });

    socketInstance.on("playerAdded", ({tournamentId, playerData, message}) => {
      // console.log("PLAYER ADDED BY WEBSOCKET:", playerData);
      // console.log(message)
      try {
        addPlayerToTournament(playerData, tournamentId);
      } catch (error) {
        console.error("addPlayer failed ", error.message);
      }
    });

    socketInstance.on("playerDropped", ({draggedItem, index, dropTarget}) => {
      try {
        handleDrop(draggedItem, index, dropTarget);
      } catch (error) {
        console.error("handleDrop failed in context: ", error.message);
      }
    });
    socketInstance.on("addPlayerToShortestQ", ({playerData, updatedTournament}) => {
      console.log(playerData);
      try {
        setCurrentTournament(updatedTournament);
        // handleAddToShortestQueue(playerData, updatedTournament);
      } catch (error) {
        console.error("Failed to update tournament data", error.message);
      }
    });
    return () => {
      console.log("Cleaning up SocketContext listeners");
      socketInstance.off("playerAdded");
      socketInstance.off("playerDropped");
      socketInstance.off("addPlayerToShortestQ");
      socketInstance.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
