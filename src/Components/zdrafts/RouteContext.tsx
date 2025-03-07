import {TRouteContextProps} from "@/types/Types";
import {createContext, useContext, useState, useEffect, ReactNode} from "react";
// import {useRouter} from "next/navigation";
import {usePathname} from "next/navigation";

const RouterContext = createContext<TRouteContextProps | undefined>(undefined);
// where is the session? should give info about the user
//   can't get to /user unless logged | redirect to /guest?
// use the session to make the decision what to show on a page
// draggable = user === admin ? true : false
// make the state depend on the url
// all-tournaments will become the main page
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
