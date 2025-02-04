import Button from "@/components/Buttons/Button";
import CategoryPill from "./CategoryPill";
import {usePathname} from "next/navigation";
import {useState} from "react";

export default function TournamentCategories({
  categories,
  tournamentId
}: {
  categories: string[];
  tournamentId: string;
}) {
  const [editMode, setEditMode] = useState(false);
  const [editedCategories, setEditedCategories] = useState([...categories]);

  const pathname = usePathname();
  const noEdit = pathname === "/all-tournaments";

  const handleEditCategory = (index: number, newCategory: string) => {
    const updatedCategories = [...editedCategories];
    updatedCategories[index] = newCategory;
    setEditedCategories(updatedCategories);
  };

  const handleDeleteCategory = (index: number) => {
    const updatedCategories = [...editedCategories];
    updatedCategories.splice(index, 1);
    setEditedCategories(updatedCategories);
  };

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

  const categoryList = editedCategories.map((category, index) => {
    return (
      <CategoryPill
        category={category}
        key={index}
        index={index}
        editMode={editMode}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    );
  });

  return (
    <div className="">
      {categoryList}
      {editMode && (
        <Button
          className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out"
          onClick={handleSaveChanges}>
          Save
        </Button>
      )}
      {noEdit ? null : (
        <Button
          className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out"
          onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "✏️"}
        </Button>
      )}
    </div>
  );
}
