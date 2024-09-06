import React, { useState } from "react";
import "./PreferencesComponent.scss";
import Select, { StylesConfig } from "react-select";
import ButtonComponent from "../button-component/ButtonComponent";
import { ExerciseRoutine } from "../../types/ExerciseRoutine";
import { ApiService } from "../../services/ApiService";
import {
  customBasicStyles,
  customLevelStyles,
  daysInTheGymOptions,
  equipmentAvailabilityOptions,
  exerpienceLevelOptions,
  overallGoalOptions,
  splitTypeOptions,
} from "../../docs/PreferencesData";

interface PreferencesProps {
  setRoutineForHome: (routine: ExerciseRoutine) => void;
}

const PreferencesComponent: React.FC<PreferencesProps> = ({
  setRoutineForHome,
}) => {
  const [generatedRoutine, setGeneratedRoutine] = useState<ExerciseRoutine>();
  const [experienceLevel, setExperienceLevel] = useState<string>();
  const [splitType, setSplitType] = useState<string>();
  const [daysInTheGym, setDaysInTheGym] = useState<string>();
  const [overallGoal, setOverallGoal] = useState<string>();
  const [equipmentAvailability, setEquipmentAvailability] = useState<string>();

  const apiService = new ApiService();

  const generateExerciseRoutine = async () => {
    console.log(
      experienceLevel,
      splitType,
      daysInTheGym,
      overallGoal,
      equipmentAvailability
    );
    try {
      if (
        experienceLevel &&
        splitType &&
        daysInTheGym &&
        overallGoal &&
        equipmentAvailability
      ) {
        const routineData = await apiService.generateRoutine(
          experienceLevel,
          splitType,
          daysInTheGym,
          overallGoal,
          equipmentAvailability
        );

        setGeneratedRoutine(routineData);
        setRoutineForHome(routineData);
      }
    } catch (error) {
      console.log("error creating a routine");
    }
  };

  return (
    <>
      <table className="preferences-table">
        <tbody>
          <tr>
            <td className="preferences-label-td">
              <label className="preferences-header" htmlFor="experienceLevel">
                Experience Level:
              </label>
            </td>
            <td className="preferences-dropdown-td">
              <Select
                options={exerpienceLevelOptions}
                styles={customLevelStyles}
                onChange={(option) => setExperienceLevel(option?.value)}
              ></Select>
            </td>
          </tr>
          <tr>
            <td className="preferences-label-td">
              <label className="preferences-header" htmlFor="splitType">
                Split Type:
              </label>
            </td>
            <td className="preferences-dropdown-td">
              <Select
                options={splitTypeOptions}
                styles={customBasicStyles}
                onChange={(option) => setSplitType(option?.value)}
              ></Select>
            </td>
          </tr>
          <tr>
            <td className="preferences-label-td">
              <label className="preferences-header" htmlFor="daysInGym">
                Days in the Gym:
              </label>
            </td>
            <td className="preferences-dropdown-td">
              <Select
                options={daysInTheGymOptions}
                styles={customLevelStyles}
                onChange={(option) => setDaysInTheGym(option?.value)}
              ></Select>
            </td>
          </tr>
          <tr>
            <td className="preferences-label-td">
              <label className="preferences-header" htmlFor="overallGoal">
                Overall Goal:
              </label>
            </td>
            <td className="preferences-dropdown-td">
              <Select
                options={overallGoalOptions}
                styles={customBasicStyles}
                onChange={(option) => setOverallGoal(option?.value)}
              ></Select>
            </td>
          </tr>
          <tr>
            <td className="preferences-label-td">
              <label
                className="preferences-header"
                htmlFor="equipmentAvailability"
              >
                Equipment Availability:
              </label>
            </td>
            <td className="preferences-dropdown-td">
              <Select
                options={equipmentAvailabilityOptions}
                styles={customBasicStyles}
                onChange={(option) => setEquipmentAvailability(option?.value)}
              ></Select>
            </td>
          </tr>
          <tr>
            <td className="preferences-label-td"></td>
            <td className="preferences-dropdown-td">
              <ButtonComponent
                label="Generate Routine"
                handleClick={generateExerciseRoutine}
              ></ButtonComponent>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default PreferencesComponent;
