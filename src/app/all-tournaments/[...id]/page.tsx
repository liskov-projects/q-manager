"use client";
import { useState, useEffect } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import TournamentQueuesPage from "@/Components/Pages/TournamentQueuesPage";
// import TournamentCategories from "@/Components/Tournaments/TournamentCategories";
import CategoryList from "@/Components/Tournaments/CategoryList";
import Image from "next/image";
import Header from "@/Components/Header";
import Button from "@/Components/Buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function TournamentPage() {
  const [editMode, toggleEditMode] = useState(false);

  const { currentTournament, setCurrentTournament, tournamentOwner } =
    useTournamentsAndQueuesContext();

  // console.log("CURRENT TOURNAMENT", currentTournament);

  const { name = "", categories = [] } = currentTournament || {};

  const [editedName, setEditedName] = useState(name);
  const [editedCategories, setEditedCategories] = useState([...categories]);

  useEffect(() => {
    if (currentTournament?._id) {
      setEditedName(currentTournament.name || "");
      setEditedCategories([...(currentTournament.categories || [])]);
    }
  }, [currentTournament?._id]);

  const formattedDate = new Date(currentTournament?.eventDate).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const inputStyles =
    "rounded focus:outline-blue focus:ring-2 focus:ring-brick-200 py-1 px-2 border-2 border-gray-300";

  async function handleSave() {
    if (!currentTournament?._id) return;

    try {
      const response = await fetch(`/api/tournament/${currentTournament._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedName,
          categories: editedCategories,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update tournament: ${response.statusText}`);
      }

      const updatedTournament = await response.json();

      setCurrentTournament(updatedTournament);

      toggleEditMode(false);
    } catch (err) {
      console.error("Error updating tournament:", err);
      // Optionally show a toast or error message
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Header and Category List */}

      <Header>
        {editMode ? (
          <input
            className={inputStyles}
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        ) : (
          <span>{name}</span>
        )}

        {tournamentOwner && (
          <>
            {/* <Button className="text-lg ml-4" onClick={() => toggleEditMode((prev) => !prev)}>
              <FontAwesomeIcon icon={faPencil} />
            </Button> */}
            {editMode ? (
              <Button
                className="mx-2 px-3 text-[0.75rem] font-semibold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out "
                onClick={handleSave}
              >
                Save
              </Button>
            ) : (
              <Button
                className="px-2 py-2 text-[0.75rem] text-lg ml-4 transform transition-transform duration-150 hover:-translate-y-0.5 ease-in-out overflow-visible"
                onClick={() => toggleEditMode((prev) => !prev)}
              >
                <FontAwesomeIcon
                  icon={faPencil}
                  className="transform transition-transform duration-150 rotate-0 hover:rotate-90"
                />
              </Button>
            )}
          </>
        )}
      </Header>

      {editMode ? (
        <div className="flex flex-col items-center w-full px-4">
          {editedCategories.map((cat, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                className={`${inputStyles} mr-2`}
                value={cat}
                onChange={(e) => {
                  const updated = [...editedCategories];
                  updated[idx] = e.target.value;
                  setEditedCategories(updated);
                }}
              />
              <Button
                className="mx-2 px-3 py-2 text-[0.75rem] font-bold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out flex items-center justify-center"
                onClick={() => {
                  const updated = editedCategories.filter((_, i) => i !== idx);
                  setEditedCategories(updated);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          ))}
          <Button
            className="mx-2 px-3 py-2 text-[0.75rem] font-semibold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out flex items-center justify-center"
            onClick={() => setEditedCategories([...editedCategories, ""])}
          >
            Add Category
          </Button>
        </div>
      ) : (
        <CategoryList
          categories={categories}
          tournamentId={currentTournament?._id}
          editedCategories={editedCategories}
          setEditedCategories={setEditedCategories}
        />
      )}

      {currentTournament?.eventDate && formattedDate}
      {/* Tournament Queues Page */}
      <TournamentQueuesPage tournamentId={currentTournament?._id} />
    </div>
  );
}
