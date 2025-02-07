import {useState} from "react";
import CategoryPill from "./CategoryPill";
import Button from "../Buttons/Button";

export default function CategoryList({
  editedCategories,
  setEditedCategories,
  className,
  editMode,
  setEditMode
}) {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() !== "" && !editedCategories.includes(newCategory)) {
      setEditedCategories([...editedCategories, newCategory]);
      setNewCategory("");
      setEditMode(false);
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
        editMode={editMode}
        onEditCategory={handleEditCategories}
        onDeleteCategory={handleDeleteCategory}
      />
    );
  });

  return (
    <div className={className}>
      {categoryList}
      {editMode && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Add category"
            className="px-2 py-1 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brick-200"
          />
          <Button
            className="px-3 py-1 bg-brick-200 text-shell-50 rounded-full text-sm hover:bg-tennis-50 hover:text-shell-100 transition"
            onClick={handleAddCategory}>
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
