import {useState} from "react";
import CategoryPill from "./CategoryPill";

export default function CategoryList({
  editedCategories,
  setEditedCategories,
  className,
  //   tournamentId,
  editMode
}) {
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

  return <div className={className}>{categoryList}</div>;
}
