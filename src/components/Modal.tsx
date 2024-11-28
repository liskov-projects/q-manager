import {ReactNode} from "react";

export default function Modal({
  isOpen,
  onClose,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-1/3">
        <button
          className="absolute top-4 right-4 text-black font-bold"
          onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
