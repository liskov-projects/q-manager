"use client";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {io} from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000/";

const SocketContext = createContext(null);

export const SocketProvider = ({children}: {children: ReactNode}) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);
    console.log("SOCKET IS SET");
    // returns a cleanup func
    return () => {
      console.log("cleanup func in SocketContext");
      socketInstance.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
