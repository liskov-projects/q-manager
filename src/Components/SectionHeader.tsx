import { ReactNode } from "react";

export default function SectionHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header className={`mb-2 flex justify-center`}>
      <h2 className={`text-2xl text-heading self-center ${className}`}>{children}</h2>
    </header>
  );
}
