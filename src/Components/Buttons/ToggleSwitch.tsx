export default function ToggleSwitch({ canEdit, setCanEdit }) {
  return (
    <div
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition duration-300
        ${canEdit ? "bg-bluestone-200" : "bg-gray-300"}`}
      onClick={() => setCanEdit(!canEdit)}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${canEdit ? "translate-x-6" : "translate-x-0"}`}
      />
    </div>
  );
}
