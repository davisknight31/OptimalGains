import React from "react";

interface InputProps {
  placeholder: string;
  type: string;
  //value: string;
  onChange: (value: string) => void;
  styles: string;
  value?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  type,
  onChange,
  styles,
  value,
  disabled,
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
          type === "number" &&
          (e.key === "-" || e.key === "." || e.key === "e") &&
          e.preventDefault()
        }
        onPaste={(e) => {
          if (type === "number") {
            const pastedText = e.clipboardData.getData("text");
            if (/[.-e]/.test(pastedText)) {
              e.preventDefault();
            }
          }
        }}
        disabled={disabled}
      ></input>
    </>
  );
};

export default Input;
