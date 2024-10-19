import {ReactNode} from "react";

export default function SectionHeader({children}: {children: ReactNode}) {
  return (
    <header className="mb-8 flex justify-center">
      <h2 className="text-2xl font-bold text-bluestone-200 self-center">
        {children}
      </h2>
    </header>
  );
}
