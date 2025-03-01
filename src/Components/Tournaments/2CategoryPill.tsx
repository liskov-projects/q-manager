export default function CategoryPill({
  category
}: {
  category: string;
  index: number;
  editMode: boolean;
  onEditCategory: (index: number, newCategory: string) => void;
  onDeleteCategory: (index: number) => void;
}) {
  return (
    <div className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium">
        {category}
    </div>
  );
}
