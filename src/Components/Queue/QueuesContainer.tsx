import React, {useState} from "react";
import QueuesGrid from "./QueuesGrid";
import QueuesGridMini from "./QueuesGridMini";
import Button from "../Buttons/Button"; // Reuse your existing Button component if available
import {useAppContext} from "@/context/AppContext";

export default function QueuesContainer() {
  const [showAlternateView, setShowAlternateView] = useState(false);
  const {addMoreQueues, queues} = useAppContext();

  return (
    <div className="p-2">
      <Button
        onClick={() => setShowAlternateView(!showAlternateView)}
        className="mb-4 mx-4 p-2 bg-blue-500 text-white font-bold rounded">
        {showAlternateView ? "Show Detailed View" : "Show Grid View"}
      </Button>
      <Button
        onClick={() => addMoreQueues(queues)}
        className="mb-4 p-2 bg-red-500 text-white font-bold rounded">
        Add more queues
      </Button>
      {showAlternateView ? <QueuesGridMini /> : <QueuesGrid />}
    </div>
  );
}
