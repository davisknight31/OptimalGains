import React from "react";

interface InputProps {
  placeholder: string;
  type: string;
  //value: string;
  onChange: (value: string) => void;
  styles: string;
  value?: string;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  type,
  onChange,
  styles,
  value,
}) => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <input
        placeholder={placeholder}
        type={type}
        onChange={onInputChange}
        className={styles}
        value={value}
        min="0"
        onKeyDown={(e) =>
          type === "number" && e.key === "-" && e.preventDefault()
        }
      ></input>
    </>
  );
};

export default Input;
