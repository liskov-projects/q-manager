export default function TagsList({item}) {
  const list = item.categories.map((category, idx) => (
    <li
      key={idx}
      className=" flex flex-row wrap border-solid border-2 rounded border-shell-300 ml-4 mr-2">
      {category}
    </li>
  ));
  return <ul>{list}</ul>;
}
