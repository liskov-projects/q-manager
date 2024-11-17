"use client";

// import {QueuesProvider} from "@/context/QueuesContext";
// import {RouteProvider} from "@/context/RouteContext";
import QueuesPage from "@/components/Pages/QueuesPage";

const App = () => {
  return (
    // doesn't seem to like nested providers => moving elsewhere
    // <QueuesProvider>
    // {/* <RouteProvider> */}
    <QueuesPage />
    // {/* </RouteProvider> */}
    // {/* </QueuesProvider> */}
  );
};

export default App;
