import RouteContextType from "@/types/RoutingContext";
import {createContext, useContext, useState, useEffect, ReactNode} from "react";
// import {useRouter} from "next/navigation";
import {usePathname} from "next/navigation";

const RouterContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider = ({children}: {children: ReactNode}) => {
  const [isGuest, setIsGuest] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    if (pathName.includes("guest")) {
      setIsGuest(true);
    } else if (pathName === undefined) {
      setIsGuest(false);
    }
  }, [pathName]);

  return (
    <RouterContext.Provider value={{isGuest, setIsGuest}}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouteContext = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useRouteContex must be used within a RouteProvider");
  return context;
};
