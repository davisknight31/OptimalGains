import React from "react";

interface InputProps {
  placeholder: string;
  type: string;
  //value: string;
  onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({ placeholder, type, onChange }) => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  //Don't think I need value attribute
  return (
    <>
      <input
        className="p-2 bg-transparent border-b-2 border-slate-100 placeholder-slate-400 mb-3 w-full focus:outline-0"
        placeholder={placeholder}
        type={type}
        onChange={onInputChange}
      ></input>
    </>
  );
};

export default Input;
