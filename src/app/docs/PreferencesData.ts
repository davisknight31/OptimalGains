import { StylesConfig } from "react-select";
import { Exercise } from "../types/exercise";

interface BasicOptionType {
  value: string;
  label: string;
}

// interface LevelOptionType {
//   value: string;
//   label: string;
//   level: DifficultyLevel;
// }

// type DifficultyLevel = keyof typeof difficultyColors;

// const difficultyColors = {
//   one: { background: "#DEEDE2", color: "#2e8b57" },
//   two: { background: "#FFFAE8", color: "#f1c40f" },
//   three: { background: "#FFF0E5", color: "#CE7100" },
//   four: { background: "#FFEAEA", color: "#CC0300" },
// } as const;

// export const customBasicStyles: StylesConfig<Exercise, false> = {
//   control: (provided, state) => ({
//     ...provided,
//     boxShadow: state.isFocused ? "0 0 0 1px ##000000" : provided.boxShadow,
//     borderColor: state.isFocused ? "#000000" : provided.borderColor,
//     "&:hover": {
//       borderColor: state.isFocused ? "#000000" : provided.borderColor,
//     },
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isFocused ? "#EFF6FF" : "white",
//     color: "#000000",
//     "&:hover": {
//       cursor: "pointer",
//     },
//     "&:active": {
//       backgroundColor: state.isFocused ? "#EFF6FF" : "white",
//     },
//   }),
//   dropdownIndicator: (provided) => ({
//     ...provided,
//     fill: "gray",
//     "& svg": {
//       fill: "gray",
//     },
//   }),
// };

export const customBasicStyles: StylesConfig<any, false> = {
  control: (provided, state) => ({
    ...provided,
    width: "200px",
    borderRadius: "0.5rem",
    borderWidth: "2px",
    boxShadow: state.isFocused ? "" : provided.boxShadow,
    borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
    "&:hover": {
      borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#FFE4B5" : "white",
    color: "#000000", // Orange color for the text
    "&:hover": {
      backgroundColor: "#FFE4B5", // Light orange background on hover
      cursor: "pointer",
    },
    "&:active": {
      backgroundColor: state.isFocused ? "#FFDAB9" : "#FFE4B5",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    fill: "gray",
    "& svg": {
      fill: "gray",
    },
  }),

  menu: (provided) => ({
    ...provided,
    width: "200px", // Adjust this value to your desired width
    border: "1px solid #f8fafc", // Optional: border color
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Optional: shadow effect
    borderRadius: "4px", // Optional: rounded corners
  }),
  // Optional: Adjust width for the menuList as well if needed
  menuList: (provided) => ({
    ...provided,
    width: "200px", // Same width as menu for consistency
  }),
};

// export const customLevelStyles: StylesConfig<LevelOptionType, false> = {
//   control: (provided, state) => ({
//     ...provided,
//     boxShadow: state.isFocused ? "0 0 0 1px #f08282" : provided.boxShadow,
//     borderColor: state.isFocused ? "#f08282" : provided.borderColor,
//     "&:hover": {
//       borderColor: state.isFocused ? "#f08282" : provided.borderColor,
//     },
//   }),

//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isFocused
//       ? difficultyColors[state.data.level].background
//       : "white",
//     color: difficultyColors[state.data.level].color,
//     "&:hover": {
//       cursor: "pointer",
//     },
//     "&:active": {
//       backgroundColor: state.isFocused
//         ? difficultyColors[state.data.level].background
//         : "white",
//     },
//   }),
//   dropdownIndicator: (provided) => ({
//     ...provided,
//     fill: "gray",
//     "& svg": {
//       fill: "gray",
//     },
//   }),
// };
