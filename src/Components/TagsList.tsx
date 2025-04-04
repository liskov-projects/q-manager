import TPlayer from "@/types/Player";

export default function TagsList({ item }: { item: TPlayer | string[] }) {
  const categories = Array.isArray(item.categories) ? item.categories : [item.categories];
  const list = categories.map((category, idx) => (
    <li key={idx} className="flex h-auto border-solid border-2 rounded border-shell-300 px-2 py-1">
      {category}
    </li>
  ));
  return <ul className="flex flex-row flex-wrap items-center">{list}</ul>;
}
