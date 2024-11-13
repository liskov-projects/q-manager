import {ReactNode} from "react";

export default function Button({
  children,
  className,
  onClick,
  disabled
}: {
  children: ReactNode;
  className: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
