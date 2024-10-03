"use client";
import React from "react";

interface ButtonProps {
  label: string;
  handleClick: () => void;
  isDisabled?: boolean;
  customStyles?: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  label,
  handleClick = () => {},
  isDisabled,
  customStyles = "",
}: ButtonProps) => {
  return (
    <>
      <button
        className={`bg-orange-500 p-3 rounded-2xl w-full hover:bg-orange-400 font-semibold text-lg  ${customStyles}`}
        onClick={() => {
          handleClick();
        }}
        disabled={isDisabled}
      >
        {label}
      </button>
    </>
  );
};

export default ButtonComponent;
