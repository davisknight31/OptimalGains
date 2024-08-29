import React from "react";
import "./ButtonComponent.scss";

interface ButtonProps {
  label: string;
  handleClick: () => void;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  label,
  handleClick = () => {},
}: ButtonProps) => {
  return (
    <>
      <button
        className="button"
        onClick={() => {
          handleClick();
        }}
      >
        {label}
      </button>
    </>
  );
};

export default ButtonComponent;
