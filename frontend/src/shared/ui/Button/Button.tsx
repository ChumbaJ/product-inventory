import { type HTMLAttributes } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  type?: "filled" | "outline";
  children?: React.ReactNode;
}

export const Button = (props: ButtonProps) => {
  const { type, children, ...rest } = props;

  const baseStyle =
    "px-6 py-2 text-sm font-medium rounded-lg focus:outline-none !cursor-pointer";
  const filledStyle = "bg-blue-500 text-white hover:bg-blue-600";
  const outlineStyle =
    "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-100";

  const buttonStyle =
    type === "filled"
      ? `${baseStyle} ${filledStyle}`
      : `${baseStyle} ${outlineStyle}`;

  return (
    <button className={buttonStyle} {...rest}>
      {children}
    </button>
  );
};