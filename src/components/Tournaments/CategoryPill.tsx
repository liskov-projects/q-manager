import Button from "../Buttons/Button";
export default function CategoryPill({
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
    <>
      {editMode ? (
        <>
          <input
            className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium focus:outline-none focus:bg-tennis-100 focus:text-shell-200"
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
    </>
  );
}
