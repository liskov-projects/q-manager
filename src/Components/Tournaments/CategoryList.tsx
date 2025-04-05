import { useState } from "react";
import CategoryPill from "./CategoryPill";
import Button from "../Buttons/Button";

export default function CategoryList({
  editedCategories,
  setEditedCategories,
  // editMode,
  // setEditMode
}: {
  editedCategories: string[];
  setEditedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() !== "" && !editedCategories.includes(newCategory)) {
      setEditedCategories([...editedCategories, newCategory]);
      setNewCategory("");
      // setEditMode(false);
    }
  };

  const handleEditCategories = (index: number, newCategory: string) => {
    const updatedCategories = [...editedCategories];
    updatedCategories[index] = newCategory;
    setEditedCategories(updatedCategories);
  };

  const handleDeleteCategory = (index: number) => {
    const updatedCategories = [...editedCategories];
    updatedCategories.splice(index, 1);
    setEditedCategories(updatedCategories);
  };

  const categoryList = editedCategories.map((category, index) => {
    return (
      <CategoryPill
        category={category}
        key={index}
        index={index}
        // editMode={editMode}
        onEditCategory={handleEditCategories}
        onDeleteCategory={handleDeleteCategory}
      />
    );
  });

  return <div className="flex flex-row">{categoryList}</div>;
}
