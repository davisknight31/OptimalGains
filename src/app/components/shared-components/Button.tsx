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
        // bg-orange-500 hover:bg-orange-400
        // className={`bg-orange-500 rounded-2xl w-full hover:bg-orange-400 font-semibold text-lg disabled:cursor-not-allowed ${customStyles}`}
        className={` rounded-2xl w-full  font-semibold text-lg disabled:cursor-not-allowed ${customStyles}`}
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
