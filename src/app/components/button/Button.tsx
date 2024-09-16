"use client";
import React from "react";

interface ButtonProps {
  label: string;
  handleClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  handleClick = () => {},
}: ButtonProps) => {
  return (
    <>
      <button
        className="bg-orange-500 text-white p-3 rounded-2xl w-full hover:bg-orange-400"
        onClick={() => {
          handleClick();
        }}
      >
        {label}
      </button>
    </>
  );
};

export default Button;
