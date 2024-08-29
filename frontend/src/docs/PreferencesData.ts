import { StylesConfig } from "react-select";

interface BasicOptionType {
  value: string;
  label: string;
}

interface LevelOptionType {
  value: string;
  label: string;
  level: DifficultyLevel;
}

type DifficultyLevel = keyof typeof difficultyColors;

const difficultyColors = {
  one: { background: "#DEEDE2", color: "#2e8b57" },
  two: { background: "#FFFAE8", color: "#f1c40f" },
  three: { background: "#FFF0E5", color: "#CE7100" },
  four: { background: "#FFEAEA", color: "#CC0300" },
} as const;

export const customBasicStyles: StylesConfig<BasicOptionType, false> = {
  control: (provided, state) => ({
    ...provided,
    boxShadow: state.isFocused ? "0 0 0 1px #f08282" : provided.boxShadow,
    borderColor: state.isFocused ? "#f08282" : provided.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? "#f08282" : provided.borderColor,
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#EFF6FF" : "white",
    color: "#0072FF",
    "&:hover": {
      cursor: "pointer",
    },
    "&:active": {
      backgroundColor: state.isFocused ? "#EFF6FF" : "white",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    fill: "gray",
    "& svg": {
      fill: "gray",
    },
  }),
};

export const customLevelStyles: StylesConfig<LevelOptionType, false> = {
  control: (provided, state) => ({
    ...provided,
    boxShadow: state.isFocused ? "0 0 0 1px #f08282" : provided.boxShadow,
    borderColor: state.isFocused ? "#f08282" : provided.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? "#f08282" : provided.borderColor,
    },
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? difficultyColors[state.data.level].background
      : "white",
    color: difficultyColors[state.data.level].color,
    "&:hover": {
      cursor: "pointer",
    },
    "&:active": {
      backgroundColor: state.isFocused
        ? difficultyColors[state.data.level].background
        : "white",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    fill: "gray",
    "& svg": {
      fill: "gray",
    },
  }),
};

export const exerpienceLevelOptions: LevelOptionType[] = [
  { value: "brandNew", label: "Brand New (< 6 Months)", level: "one" },
  { value: "beginner", label: "Beginner (6 Months-2 Years)", level: "two" },
  { value: "intermediate", label: "Intermediate (2-5 Years)", level: "three" },
  { value: "advanced", label: "Advanced (5+ Years)", level: "four" },
];

export const splitTypeOptions: BasicOptionType[] = [
  { value: "fullBody", label: "Full Body" },
  { value: "upperLower", label: "Upper / Lower" },
  { value: "ppl", label: "PPL" },
  { value: "arnold", label: "Arnold" },
];

export const daysInTheGymOptions: LevelOptionType[] = [
  { value: "three", label: "Three", level: "one" },
  { value: "four", label: "Four", level: "two" },
  { value: "five", label: "Five", level: "three" },
  { value: "six", label: "Six", level: "four" },
];

export const overallGoalOptions: BasicOptionType[] = [
  { value: "generalHealth", label: "General Health" },
  { value: "hypertrophy", label: "Hypertrophy" },
  { value: "strength", label: "Strength" },
  { value: "powerbuilding", label: "Powerbuilding (Strength + Hypertrophy)" },
];

export const equipmentAvailabilityOptions: BasicOptionType[] = [
  { value: "noWeights", label: "No Weights" },
  { value: "lightDumbbells", label: "Light Dumbbells" },
  { value: "dumbbells", label: "Dumbbells" },
  {
    value: "dumbbellsBarbellRack",
    label: "Dumbbells and Barbell + Rack",
  },
  {
    value: "gymWithBasicMachines",
    label: "Gym with Basic Machines",
  },
  {
    value: "gymWithEverything",
    label: "Gym with Everything",
  },
];
