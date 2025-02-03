import Button from "@/components/Buttons/Button";
import {usePathname} from "next/navigation";

export default function TournamentCategories({
  categories,
  children
}: {
  categories: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noEdit = pathname === "/all-tournaments";

  const categoryList = categories.map((cat, index) => {
    return <CategoryPill category={cat} key={index} />;
  });

  return (
    <div>
      <div className="mt-2">
        {children}
        {categoryList}
        {noEdit ? null : (
          <Button
            className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium hover:bg-tennis-50 hover:text-shell-300 transition-colors duration-200 ease-in-out"
            onClick={() => setEditMode(true)}>
            ✏️
          </Button>
        )}
      </div>
    </div>
  );
}

function CategoryPill({category}: {category: string}) {
  return (
    <span className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium">
      {category}
    </span>
  );
}
