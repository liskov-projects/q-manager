import Button from "@/components/Buttons/Button";
import {usePathname} from "next/navigation";
import {useState} from "react";

export default function TournamentCategories({
  categories,
  children
}: {
  categories: string[];
  children: React.ReactNode;
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
  const handleSaveChanges = async () => {
    // FIXME:
    // await fetch("/alltournaments") send data to BE
    setEditMode(false);
  };

  const categoryList = editedCategories.map((cat, index) => {
    return (
      <CategoryPill
        category={cat}
        key={index}
        index={index}
        editMode={editMode}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    );
  });
  return (
    <div>
      <div className="mt-2">
        {children}
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
    </div>
  );
}

// TODO: extract into a separate component
function CategoryPill({
  category,
  index,
  editMode,
  onEditCategory,
  onDeleteCategory
}: {
  category: string;
  index: number;
  editMode: boolean;
  onEditCategory: (index: number, newCategory: string) => void;
  onDeleteCategory: (index: number) => void;
}) {
  return (
    <span>
      {editMode ? (
        <>
          <input
            className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium focus:outline-none focus:bg-tennis-100 focus:text-shell-00"
            type="text"
            value={category}
            onChange={e => onEditCategory(index, e.target.value)}
          />
          <Button
            className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out"
            onClick={() => onDeleteCategory(index)}>
            X
          </Button>
        </>
      ) : (
        <span className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium">
          {category}
        </span>
      )}
    </span>
  );
}
