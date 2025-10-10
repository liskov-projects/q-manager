"use client";
// libraries
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QRCodeCanvas } from "qrcode.react";
// hooks
import { useState, useEffect, useRef } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
// components
import TournamentQueuesPage from "@/Components/Pages/TournamentQueuesPage";
import CategoryList from "@/Components/Tournaments/CategoryList";
import Header from "@/Components/Header";
import Button from "@/Components/Buttons/Button";
import { faPencil, faTrash, faQrcode, faBottleDroplet } from "@fortawesome/free-solid-svg-icons";

// TODO: clean up & move formattedDate in the context
export default function TournamentPage() {
  const [editMode, toggleEditMode] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const qrRef = useRef(null);
  const { currentTournament, setCurrentTournament, tournamentOwner, currentTournamentRef } =
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

  function generateQR() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${name.replace(/\s+/g, "_")}_qr.png`;
    downloadLink.click();
  }

  function printQR() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            img { max-width: 100%; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print(); window.close()" />
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  const tournamentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/tournament/${currentTournamentRef._id}`;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Header and Category List */}

      <Header >
        {editMode ? (
          <input
            className="p-1"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            style={{ width: `${editedName.length + 2}ch` }}
          />
        ) : (
          <span>{name}</span>
        )}

        {tournamentOwner && (
          <>
            <Button
              className="px-2 text-[0.75rem]  text-lg ml-4 transform transition-transform duration-150 hover:-translate-y-0.5 ease-in-out overflow-visible"
              onClick={() => setShowQR(!showQR)}
            >
              <FontAwesomeIcon title="QR Code" icon={faQrcode} />
            </Button>
            {showQR && (
              <div className="flex flex-col items-center mt-2" ref={qrRef}>
                <QRCodeCanvas value={tournamentUrl} size={180} includeMargin={true} />
                <div className="flex gap-2 mt-2">
                  <Button
                    className="px-3 py-1 text-sm border-2 border-bluestone-200 rounded hover:bg-brick-200 hover:text-shell-300 hover:border-brick-100 hover:text-shell-75"
                    onClick={generateQR}
                  >
                    Download QR
                  </Button>
                  <Button
                    className="px-3 py-1 text-sm border-2 border-bluestone-200 rounded hover:bg-brick-200 hover:text-shell-300 hover:border-brick-100 hover:text-shell-75"
                    onClick={printQR}
                  >
                    Print QR
                  </Button>
                </div>
              </div>
            )}
            {editMode ? (
              <div>
                <Button
                  className="mx-2 px-3 text-[0.75rem] font-semibold rounded text-shell-100 bg-brick-200 hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out "
                  onClick={handleSave}
                >
                  Save
                </Button>
                <label htmlFor="image">
                  <button
                    type="button"
                    onClick={() => document.getElementById("editImage")?.click()}
                    className="bg-gray-200 items-center cursor-pointer rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-150 text-sm p-2"
                  >
                    Choose Image
                  </button>
                </label>
                <input type="file" id="editImage" hidden />
              </div>
            ) : (
              <Button
                className="px-2 py-2 text-[0.75rem] text-lg ml-4 transform transition-transform duration-150 hover:-translate-y-0.5 ease-in-out overflow-visible"
                onClick={() => toggleEditMode((prev) => !prev)}
              >
                <FontAwesomeIcon
                  title="Edit"
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
