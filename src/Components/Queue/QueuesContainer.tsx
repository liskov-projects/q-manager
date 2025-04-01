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
          className="mb-4 mx-4 py-1 px-2 bg-bluestone-200 text-shell-50 hover:text-shell-300 hover:bg-tennis-200 rounded position-center rounded"
        >
          {showAlternateView ? "Show Detailed View" : "Show Grid View"}
        </Button>
      </div>
      {showAlternateView ? <QueuesGridMini /> : <QueuesGrid />}
    </div>
  );
}
