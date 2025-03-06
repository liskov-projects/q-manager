"use client";

import {createContext, useContext, useEffect, ReactNode, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useTournamentsAndQueuesContext} from "./TournamentsAndQueuesContext";
// NEW:
import useDragNDrop from "@/hooks/useDragNDrop";

const SOCKET_URL: string =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000/";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({children}: {children: ReactNode}) => {
  const {addPlayerToTournament, currentTournament} = useTournamentsAndQueuesContext();
  // NEW:
  const {handleDrop} = useDragNDrop();

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance); // ✅ Save socket instance in state

    console.log("🔌 Connecting to WebSocket...");

    // ✅ Attach event listeners immediately
    socketInstance.on("connect", () => {
      console.log("✅ WebSocket Connected, Socket ID:", socketInstance.id);
    });

    //WORKS: Update global tournament state when a tournament update is received
    socketInstance.on("playerAdded", ({tournamentId, playerData, message}) => {
      // console.log("PLAYER ADDED BY WEBSOCKET:", playerData);
      // console.log("WHERE IS THE MESSAGE FROM")
      // console.log(message)
      addPlayerToTournament(playerData, tournamentId);
    });

    // NEW:
    socketInstance.on("playerDropped", ({message, draggedItem, index, tournamentId, drop}) => {
      console.log("player dropped", draggedItem);
      console.log("player dropped message", message);


      
            if (!currentTournament) {
              console.error("Tournament not found.");
              return socketInstance.emit("errorMessage", {error: "Tournament not found"});
            }
      
            //removes item from their source arrays
            const newUnprocessedItems = currentTournament.unProcessedQItems.filter(
              item => item._id !== draggedItem._id
            );
      
            const newProcessedItems = currentTournament.processedQItems.filter(
              item => item._id !== draggedItem._id
            );
      
            // makes a copy of the queues & ensures there're no references to MongoDB properties (pure JS object) with 
            const newQueues = currentTournament.queues.map(queue => ({
              ...queue, //here
              queueItems: queue.queueItems.filter(
                item => item._id !== draggedItem._id
              )
            }));
      
            // adds items to the correesponding group
            if (dropTarget === "unprocessed") {
              newUnprocessedItems.splice(index + 1, 0, draggedItem);
            } else if (dropTarget === "processed") {
              newProcessedItems.splice(index + 1, 0, draggedItem);
            } else {
              const queueToSplice = newQueues.find(
                queue => queue._id === dropTarget
              );
      
              if (queueToSplice) {
                queueToSplice.queueItems = [
                  ...queueToSplice.queueItems.slice(0, index + 1),
                  draggedItem,
                  ...queueToSplice.queueItems.slice(index + 1)
                ];
              }
            }
      
            //sends the updated tournament to the DB
            const updatedTournament = await TournamentModel.findByIdAndUpdate(
              tournamentId,
              {
                $set: {
                  unProcessedQItems: newUnprocessedItems,
                  processedQItems: newProcessedItems,
                  queues: newQueues
                }
              },
              {new: true}
            );
    });

    return () => {
      console.log("Cleaning up SocketContext listeners");
      socketInstance.off("playerAdded");
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
