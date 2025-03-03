"use client";

import {createContext, useContext, useEffect, ReactNode} from "react";
import {io, Socket} from "socket.io-client";
import {useTournamentsAndQueuesContext} from "./TournamentsAndQueuesContext";

const SOCKET_URL: string =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000/";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({children}: {children: ReactNode}) => {
  const {addPlayerToTournament} = useTournamentsAndQueuesContext();
  const socket = io(SOCKET_URL);

  useEffect(() => {
    console.log("SOCKET CONNECTED");

    // Update global tournament state when a tournament update is received
    socket.on("playerAdded", ({tournamentId, playerData}) => {
      console.log("Player added by websocket:", playerData);
      addPlayerToTournament(playerData, tournamentId);
    });

    return () => {
      console.log("Cleaning up SocketContext listeners");
      socket.off("playerAdded");
      socket.disconnect();
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

// "use client";
// import {createContext, ReactNode, useContext, useEffect, useState} from "react";
// import {io} from "socket.io-client";

// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000/";

// const SocketContext = createContext(null);

// export const SocketProvider = ({children}: {children: ReactNode}) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const socketInstance = io(SOCKET_URL);
//     setSocket(socketInstance);

//     console.log("SOCKET IS SET");
//     // returns a cleanup func
//     return () => {
//       console.log("cleanup func in SocketContext");
//       socketInstance.disconnect();
//     };
//   }, []);
//   // console.log("socket id: ", socket);

//   return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
// };

// export const useSocket = () => useContext(SocketContext);
