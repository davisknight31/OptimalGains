"use client";
import React from "react";

interface ButtonProps {
  label: string;
  handleClick: () => void;
  customStyles?: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  label,
  handleClick = () => {},
  customStyles = "",
}: ButtonProps) => {
  return (
    <>
      <button
        className={`bg-orange-500 text-white p-3 rounded-2xl w-full hover:bg-orange-400 font-semibold text-lg ${customStyles}`}
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
