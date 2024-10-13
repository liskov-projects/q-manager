import {ReactNode} from "react";

export default function SectionHeader({children}: {children: ReactNode}) {
  return (
    <header className="mb-8">
      <h2 className="text-2xl font-bold text-gray-700">{children}</h2>
    </header>
  );
}
