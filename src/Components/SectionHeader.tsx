import { ReactNode } from "react";

export default function SectionHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header className={`flex justify-center`}>
      <h2 className={`text-2xl text-heading ${className}`}>{children}</h2>
    </header>
  );
}
