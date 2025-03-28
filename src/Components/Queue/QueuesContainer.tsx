"use client";
// hooks
import { useState } from "react";
// components
import QueuesGrid from "./QueuesGrid";
import QueuesGridMini from "./QueuesGridMini";
import SectionHeader from "../SectionHeader";
import Button from "../Buttons/Button";

export default function QueuesContainer() {
  const [showAlternateView, setShowAlternateView] = useState(false);

  return (
    <div className="p-2">
      <div className="flex justify-between">
        <SectionHeader>Queues</SectionHeader>
        <Button
          onClick={() => setShowAlternateView(!showAlternateView)}
          className="mb-4 mx-4 p-2 bg-blue-500 text-white font-bold rounded"
        >
          {showAlternateView ? "Show Detailed View" : "Show Grid View"}
        </Button>
      </div>
      {showAlternateView ? <QueuesGridMini /> : <QueuesGrid />}
    </div>
  );
}
