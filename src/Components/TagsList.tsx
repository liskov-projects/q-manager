import TPlayer from "@/types/Player";

export default function TagsList({ item }: { item: TPlayer | string[] }) {
  const categories = Array.isArray(item.categories) ? item.categories : [item.categories];
  const list = categories.map((category: string[], idx: number) => (
    <li
      key={idx}
      className="flex flex-wrap text-xs font-semibold h-auto border-solid border-2 rounded border-shell-300 px-1 py-[1px] m-[1px]"
    >
      {category}
    </li>
  ));
  return <ul className="flex flex-row flex-wrap items-center">{list}</ul>;
}
