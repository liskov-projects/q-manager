import { ReactNode } from "react";

export default function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <header className="mb-2 flex justify-center">
      <h2 className="text-2xl text-heading self-center">{children}</h2>
    </header>
  );
}
