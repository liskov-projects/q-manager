"use client";

import React, {useState} from "react";
import QueuesGrid from "./QueuesGrid";
import QueuesGridMini from "./QueuesGridMini";
import SectionHeader from "../SectionHeader";
import Button from "../Buttons/Button";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";
import NewQueueForm from "../Forms/NewQueueForm"

export default function QueuesContainer() {
  const [showAlternateView, setShowAlternateView] = useState(false);
  const {addMoreQueues, removeQueues, queues} = useTournamentsAndQueuesContext();
  const [showQueueForm, setShowQueueForm] = useState(false)
  const {tournamentOwner} = useTournamentsAndQueuesContext();

  const toggleQueueForm = () => {
    setShowQueueForm((prev) => !prev);
  }

  return (
    <div className="p-2">
      <SectionHeader>Queues</SectionHeader>
      {tournamentOwner && showQueueForm && <NewQueueForm />}
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
            + queue
          </Button>
          <Button
            onClick={() => removeQueues()}
            className="mb-4 mx-4 p-2 bg-red-500 text-white font-bold rounded">
            - queue
          </Button>
          <Button
            onClick={() => toggleQueueForm()}
            className="mb-4 mx-4 p-2 bg-red-500 text-white font-bold rounded">
            new queue form
          </Button>
        </>
      )}
      {showAlternateView ? <QueuesGridMini /> : <QueuesGrid />}
    </div>
  );
}
