"use client";

import React, {useState} from "react";
import QueuesGrid from "./QueuesGrid";
import QueuesGridMini from "./QueuesGridMini";
import SectionHeader from "../SectionHeader";
import Button from "../Buttons/Button";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import NewQueueForm from "../Forms/NewQueueForm";

export default function QueuesContainer() {
  const [showAlternateView, setShowAlternateView] = useState(false);
  const {addMoreQueues, removeQueues, queues} = useTournamentsAndQueuesContext();
  // const {isSignedIn} = useUser();
  const {tournamentOwner} = useTournamentsAndQueuesContext();

  return (
    <div className="p-2">
      <div className="flex justify-between items-center">
        <SectionHeader>Queues</SectionHeader>
        <NewQueueForm />
      </div>
      <Button
        onClick={() => setShowAlternateView(!showAlternateView)}
        className="mb-4 mx-4 p-2 bg-blue-500 text-white font-bold rounded">
        {showAlternateView ? "Show Detailed View" : "Show Grid View"}
      </Button>
      {!tournamentOwner ? null : (
        <>
          <Button
            onClick={() => addMoreQueues()}
            className="mb-4 p-2 bg-red-500 text-white font-bold rounded">
            Add more queues
          </Button>
          <Button
            onClick={() => removeQueues()}
            className="mb-4 mx-4 p-2 bg-red-500 text-white font-bold rounded">
            Remove a queue
          </Button>
        </>
      )}
      {showAlternateView ? <QueuesGridMini /> : <QueuesGrid />}
    </div>
  );
}
