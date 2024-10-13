import {ReactNode} from "react";

export default function Button({
  children,
  className,
  onClick
}: {
  children: ReactNode;
  className: string;
  onClick: () => void;
}) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
