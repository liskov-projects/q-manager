import Button from "@/components/Buttons/Button";
import CategoryList from "./CategoryList";
import {usePathname} from "next/navigation";
import {useState, useEffect} from "react";
import {useTournamentsAndQueuesContext} from "@/context/TournamentsAndQueuesContext";

export default function TournamentCategories({
  categories = [],
  tournamentId
}: {
  categories: string[];
  tournamentId: string;
}) {
  const {tournamentOwner} = useTournamentsAndQueuesContext();
  const [editedCategories, setEditedCategories] = useState([...categories]);

  const [editMode, setEditMode] = useState(false);

  const pathname = usePathname();
  const canEdit = pathname === "/all-tournaments" || !tournamentOwner;

  // NOTE: unsire if it makes more good that bad
  useEffect(() => {
    setEditedCategories(categories);
  }, [categories]);

  const handleSaveChanges = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const updatedCategories = [...editedCategories];
    try {
      const res = await fetch(`api/tournaments/${tournamentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedCategories)
      });

      if (res.ok) {
        // do we want to get back the tournament or only its categories?
        const updatedCategories = await res.json();
        console.log("getting the updated categories", updatedCategories);
      }
    } catch (error) {
      console.error("Couldn't update the categories", error);
    }
    setEditMode(false);
  };

  return (
    <div className="">
      <CategoryList
        className="flex flex-row"
        editedCategories={editedCategories}
        setEditedCategories={setEditedCategories}
        editMode={editMode}
        setEditMode={setEditMode}
      />
      {canEdit ? null : (
        <Button
          className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out"
          onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "✏️"}
        </Button>
      )}
      {editMode && (
        <Button
          className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out"
          onClick={handleSaveChanges}>
          Save
        </Button>
      )}
    </div>
  );
}
