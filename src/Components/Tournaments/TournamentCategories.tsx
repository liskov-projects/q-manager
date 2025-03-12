// hooks
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
// components
import CategoryList from "./CategoryList";

export default function TournamentCategories({
  categories = [],
  tournamentId,
}: {
  categories: string[];
  tournamentId: string | undefined;
}) {
  const { tournamentOwner } = useTournamentsAndQueuesContext();
  const [editedCategories, setEditedCategories] = useState([...categories]);

  const pathname = usePathname();
  const canEdit = pathname === "/all-tournaments" || !tournamentOwner;

  useEffect(() => {
    setEditedCategories(categories);
  }, [categories]);

  // NOTE: might be needed for the dashboard thing to edit a tournament
  const handleSaveChanges = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const updatedCategories = [...editedCategories];
    try {
      const res = await fetch(`api/tournaments/${tournamentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategories),
      });

      if (res.ok) {
        const updatedCategories = await res.json();
        console.log("getting the updated categories", updatedCategories);
      }
    } catch (error) {
      console.error("Couldn't update the categories", error);
    }
  };

  return (
    <div className="flex flex-col">
      <CategoryList editedCategories={editedCategories} setEditedCategories={setEditedCategories} />
    </div>
  );
}
