import { ReactNode } from "react";

export default function ToggleSwitch({
  isOn,
  setIsOn,
  children,
}: {
  isOn: boolean;
  setIsOn: (value: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="h-30 w-[85%] p-2 bg-shell-75 text-bluestone-200 rounded-lg shadow-left-bottom-lg flex flex-row justify-between items-center my-2">
      {children}
      <div
        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition duration-300
        ${isOn ? "bg-bluestone-200" : "bg-gray-300"}`}
        onClick={() => setIsOn(!isOn)}
      >
        <div
          className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${isOn ? "translate-x-6" : "translate-x-0"}`}
        />
      </div>
    </label>
  );
}
