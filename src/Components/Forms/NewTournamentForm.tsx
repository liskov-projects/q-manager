"use client";

import { useState, useEffect } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useUser } from "@clerk/nextjs";
// types
import { TTournament } from "@/types/Types";
// components
import Button from "../Buttons/Button";
import SectionHeader from "../SectionHeader";

type TTournamentForm = Partial<TTournament> & {
  numberOfQueues: number | string;
  image?: string | File;
};

export default function NewTournamentForm() {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newTournament, setNewTournament] = useState<TTournamentForm>({
    name: "",
    categories: [],
    adminUser: "",
    image: "",
    description: "",
    numberOfQueues: 3, // ✅ Start at 3
    eventDate: "",
  });

  const { isSignedIn, user } = useUser();
  const { fetchTournaments, uniqueCategories } = useTournamentsAndQueuesContext();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCategories(newTournament?.categories || []);
  }, [newTournament?.categories]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files[0]) {
      setErrorMessage("");
      const file = files[0];
      setNewTournament({
        ...newTournament,
        [name]: file,
      });
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      if (name === "numberOfQueues") {
        const num = Math.max(0, Number(value)); // ✅ no negatives
        setNewTournament({
          ...newTournament,
          [name]: num,
        });
      } else {
        setNewTournament({
          ...newTournament,
          [name]: value,
        });
      }
    }
  }

  function increaseQueues() {
    setNewTournament((prev) => ({
      ...prev,
      numberOfQueues: typeof prev.numberOfQueues === "number" ? prev.numberOfQueues + 1 : 1,
    }));
  }

  function decreaseQueues() {
    setNewTournament((prev) => ({
      ...prev,
      numberOfQueues:
        typeof prev.numberOfQueues === "number" ? Math.max(0, prev.numberOfQueues - 1) : 0,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let imageUrl = "";

    if (!newTournament.image || !(newTournament.image instanceof File)) {
      setErrorMessage("Please upload a tournament image.");
      return;
    }

    if (newTournament.image instanceof File) {
      const file = newTournament.image;
      const res = await fetch(
        `/api/gcs-uploads?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`
      );
      const { uploadUrl, publicUrl } = await res.json();

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      imageUrl = publicUrl;
      URL.revokeObjectURL(previewUrl || "");
      setPreviewUrl(null);
    }

    const eventDate = newTournament.eventDate ? newTournament.eventDate : null;

    const newItem = {
      name: newTournament.name,
      categories: selectedCategories,
      adminUser: user?.id,
      image: imageUrl,
      description: newTournament.description,
      numberOfQueues: newTournament.numberOfQueues,
      eventDate: eventDate,
    };

    try {
      const res = await fetch("/api/tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        fetchTournaments();
        setSuccessMessage("Tournament added");
      } else if (res.status === 409) {
        setErrorMessage("Tournament with this name already exists");
      } else {
        throw new Error("Error adding item, status: " + res.status);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error adding item: ", err.message);
        setErrorMessage("Error adding tournament");
      }
    }

    setNewTournament({
      name: "",
      categories: [],
      adminUser: "",
      image: "",
      description: "",
      numberOfQueues: 3, // ✅ Reset back to 3 after submit
      eventDate: "",
    });
  }

  if (!isSignedIn) {
    return (
      <div className="text-center text-lg font-extrabold text-bluestone-200 mt-0">
        You need to sign in to create a tournament.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-start">
        <SectionHeader>Add New Tournament</SectionHeader>
      </div>

      {isExpanded && (
        <form
          className="flex flex-col items-start justify-around"
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        >
          {/* Tournament Name */}
          <label htmlFor="name">Tournament Name</label>
          <input
            type="text"
            name="name"
            value={newTournament.name}
            onChange={handleChange}
            className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 mb-2 w-full"
          />

          {/* Tournament Image Upload */}
          <label htmlFor="image" className="cursor-pointer flex flex-col">
            <div>
              Tournament Image <span className="text-brick-200">*</span>{" "}
            </div>
            <button
              className="bg-gray-200  items-center rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-150"
              onClick={() => document.getElementById("image")?.click()}
              type="button"
            >
              Choose File
            </button>
          </label>

          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className={`focus:outline rounded-md px-3 py-2 focus:ring-2 mb-2 w-full hidden ${
              !newTournament.image && errorMessage
                ? "border-2 border-brick-200"
                : "focus:ring-brick-200"
            }`}
          />
          {previewUrl && (
            <div>
              <p className="text-sm text-gray-600">Image Preview:</p>
              <img
                src={previewUrl}
                alt="Tournament Preview"
                className="rounded-md w-48 h-32 object-cover border border-gray-300 mb-2"
              />
            </div>
          )}

          {/* Description */}
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={newTournament.description}
            onChange={handleChange}
            className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 mb-2 w-full"
          />

          {/* Number of Queues with + and - */}
          <label htmlFor="numberOfQueues">Number of Queues</label>
          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={decreaseQueues}
              className="bg-brick-200 text-white px-3 py-1 rounded hover:bg-brick-300"
              disabled={newTournament.numberOfQueues === 0}
            >
              -
            </button>
            <input
              placeholder="3"
              type="number"
              name="numberOfQueues"
              min="0"
              value={newTournament.numberOfQueues}
              onChange={handleChange}
              className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 w-20 text-center"
            />
            <button
              type="button"
              onClick={increaseQueues}
              className="bg-brick-200 text-white px-3 py-1 rounded hover:bg-brick-300"
            >
              +
            </button>
          </div>

          {/* Date */}
          <label htmlFor="eventDate">Date</label>
          <input
            type="date"
            name="eventDate"
            value={newTournament.eventDate}
            onChange={handleChange}
            className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 mb-2 w-full"
          />

          {/* Submit Button */}
          <Button className="self-center my-6 bg-bluestone-200 text-shell-50 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded">
            Add the Tournament!
          </Button>

          {/* Messages */}
          {errorMessage && (
            <span className="text-brick-200 text-center text-xl">{errorMessage}</span>
          )}
          {successMessage && (
            <span className="text-bluestone-200 text-center text-xl">{successMessage}</span>
          )}
        </form>
      )}
    </div>
  );
}
