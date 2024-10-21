import {ReactNode} from "react";

export default function Button({
  children,
  className,
  type,
  onClick
}: {
  children: ReactNode;
  className: string;
  type: string;
  onClick: () => void;
}) {
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}
