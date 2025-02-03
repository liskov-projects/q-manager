export default function TournamentCategories({categories}: {categories: string[]}) {
  const categoryList = categories.map((cat, index) => {
    return <CategoryPill category={cat} key={index} />;
  });

  return <div className="mt-2">{categoryList}</div>;
}

function CategoryPill({category}: {category: string}) {
  return (
    <span className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium">
      {category}
    </span>
  );
}
