import { useUser } from "@/app/contexts/UserContext";
import { Period } from "@/app/types/period";
import { Routine } from "@/app/types/routine";
import React, { useEffect, useState } from "react";
import Select from "react-select";

interface EditRoutineProps {
  period?: Period;
  // refreshPeriods: () => void;
}

interface RoutineOption {
  label: string;
  value: Routine;
}

const EditPeriod: React.FC<EditRoutineProps> = ({ period }) => {
  const { user } = useUser();
  const [routineOptions, setRoutineOptions] = useState<RoutineOption[]>([]);
  const [associatedRoutine, setAssociatedRoutine] = useState<Routine>();

  useEffect(() => {
    setAssociatedRoutine(
      user?.routines?.find((routine) => period?.routineId === routine.routineId)
    );
    createRoutineOptions();
  }, []);

  function createRoutineOptions(): void {
    if (user?.routines) {
      const createdRoutineOptions = user?.routines.map((routine) => {
        return { label: routine.routineName, value: routine };
      });
      setRoutineOptions(createdRoutineOptions);
    }
  }
  return (
    //so

    //maybe actually don't need to do any of this
    //probably need copy of routine created for the period, so maybe need period routines table
    //the copy is necessary because if a routine is updated it shouldnt be in the period since that would screw with progress
    //may need to adjust the edit period page to be period overview, so

    //could actually be
    //periods page has list of all periods
    //the edit page is just a 'view' page where the period can be viewed, plus all the workouts completed, with progress
    //this will allow the user to see their progress in old periods, nothing should be editable though really.

    //Edit the period name, length in weeks, associated routine
    //Only editable when the period is not active,
    //need to be able to updated associated routine,
    //the workouts part of that routine should be edited in the edit routines tab, so no need to do that
    <>
      <div>{period?.periodName}</div>
      <div>{associatedRoutine?.routineName}</div>
      <Select options={routineOptions}></Select>
    </>
  );
};

export default EditPeriod;
