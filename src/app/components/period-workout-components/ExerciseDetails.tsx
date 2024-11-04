// "use client";
import { Exercise } from "@/app/types/exercise";
import { PeriodExercise } from "@/app/types/periodExercise";
import { WorkoutExercise } from "@/app/types/workoutExercise";
import React, { useEffect, useState } from "react";
import Input from "../shared-components/Input";
import { inputStyles } from "@/app/docs/PreferencesData";
import Modal from "../shared-components/Modal";
import ButtonComponent from "../shared-components/Button";
import { PeriodSet } from "@/app/types/periodSet";
import { determineNewReps, determineNewWeight } from "@/app/utils/helpers";

interface ExerciseDetailsProps {
  workoutExercise: WorkoutExercise;
  comparisonExercise?: PeriodExercise;
  exercise: Exercise;
  handleExerciseDataChange: (
    periodExercise: PeriodExercise | undefined
  ) => void;
}

const defaultExercise: PeriodExercise = {
  workoutExerciseId: 0,
  periodSets: [],
};

const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({
  workoutExercise,
  comparisonExercise,
  exercise,
  handleExerciseDataChange,
}) => {
  const [progressedExercise, setProgressedExercise] = useState<
    PeriodExercise | undefined
  >();
  const [showComparisonModal, setShowComparisonModal] =
    useState<boolean>(false);

  useEffect(() => {
    setProgressedExercise(defaultExercise);
    checkPreviousPerformances();
  }, []);

  useEffect(() => {
    console.log(progressedExercise);
    handleExerciseDataChange(progressedExercise);
  }, [progressedExercise]);

  function checkPreviousPerformances() {
    if (comparisonExercise) {
      //if a set is found where target reps were not hit, then set to false, otherwise true
      const hitAllTargets = comparisonExercise.periodSets.find(
        (set) => set.targetReps !== set.actualReps
      )
        ? false
        : true;

      const allSameWeight = comparisonExercise.periodSets.every(
        (set) => set.weight === comparisonExercise.periodSets[0].weight
      );

      const calculatedProgressedExercise =
        hitAllTargets && allSameWeight
          ? createProgressedExercise()
          : createNonProgressedExercise();

      setProgressedExercise(calculatedProgressedExercise);
    } else {
      //create initial details probably based on user's 1 rep maxes//8-12 rep maxes
      //or previous workout performances in other periods eventually
      //for now, let the user choose their first weight
      const initalExercise = createInitialExercise();
      setProgressedExercise(initalExercise);
    }
  }

  function createProgressedExercise(): PeriodExercise {
    // ! can be used on comparisonExercise since a check was included in checkPreviousPerformances
    const newSets: PeriodSet[] = comparisonExercise!.periodSets.map(
      (periodSet, periodSetIndex) => {
        if (exercise.progressionStyle === "Weight Priority") {
          const newWeight = determineNewWeight(exercise, periodSet);
          const newSet: PeriodSet = {
            setNumber: periodSetIndex + 1,
            targetReps: 12,
            actualReps: 0,
            weight: newWeight,
          };
          return newSet;
        } else {
          const newReps = determineNewReps(periodSet);
          const newSet: PeriodSet = {
            setNumber: periodSetIndex + 1,
            targetReps: newReps,
            actualReps: 0,
            weight: periodSet.weight,
          };
          return newSet;
        }
      }
    );
    const newPeriodExercise: PeriodExercise = {
      workoutExerciseId: comparisonExercise!.workoutExerciseId,
      periodSets: newSets,
    };
    return newPeriodExercise;
  }

  function createNonProgressedExercise(): PeriodExercise {
    const newSets: PeriodSet[] = comparisonExercise!.periodSets.map(
      (periodSet, periodSetIndex) => {
        return {
          setNumber: periodSetIndex + 1,
          targetReps: periodSet.targetReps,
          actualReps: 0,
          weight: comparisonExercise!.periodSets[0].weight,
        };
      }
    );
    const newPeriodExercise: PeriodExercise = {
      workoutExerciseId: comparisonExercise!.workoutExerciseId,
      periodSets: newSets,
    };
    return newPeriodExercise;
  }

  function createInitialExercise(): PeriodExercise {
    const newSets: PeriodSet[] = Array.from(
      { length: workoutExercise.sets },
      (_, i) => ({
        setNumber: i + 1,
        targetReps: 0,
        actualReps: 0,
        weight: 0,
      })
    );

    const newPeriodExercise: PeriodExercise = {
      workoutExerciseId: workoutExercise.workoutExerciseId!,
      periodSets: newSets,
    };
    return newPeriodExercise;
  }

  function handleRepsChange(set: PeriodSet, newReps: string): void {
    console.log(newReps);
    console.log(set);
    if (newReps.length >= 0 && newReps.length < 3) {
      console.log("hit");
      setProgressedExercise({
        ...progressedExercise,
        periodSets: progressedExercise?.periodSets.map((periodSet) =>
          periodSet.setNumber === set.setNumber
            ? { ...periodSet, actualReps: parseInt(newReps) }
            : periodSet
        ),
      } as PeriodExercise);
    } else {
      setProgressedExercise(progressedExercise);
    }
  }

  function handleWeightChange(set: PeriodSet, newWeight: string): void {
    if (newWeight.length >= 0 && newWeight.length < 4) {
      setProgressedExercise({
        ...progressedExercise,
        periodSets: progressedExercise?.periodSets.map((periodSet) =>
          periodSet.setNumber === set.setNumber
            ? { ...periodSet, weight: parseInt(newWeight) }
            : periodSet
        ),
      } as PeriodExercise);
    } else {
      setProgressedExercise(progressedExercise);
    }
  }

  return (
    <>
      <div className="bg-slate-50 rounded-2xl p-4 w-full mb-5 mt-5">
        <div className="text-slate-500 font-bold text-xl">
          {exercise.exerciseName}
        </div>
        {progressedExercise?.periodSets
          .sort((a, b) => a.setNumber - b.setNumber)
          .map((set, setIndex) => (
            <div key={set.setNumber} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-bold text-slate-600">
                  {"Set " + set.setNumber}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-slate-500 text-sm">
                  Goal Reps: {set.targetReps}
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Reps"
                  styles={inputStyles + " flex-1 text-center"}
                  value={set.actualReps <= 0 ? "" : set.actualReps.toString()}
                  onChange={(newValue) => handleRepsChange(set, newValue)}
                />
                <Input
                  type="number"
                  placeholder="Weight"
                  styles={inputStyles + " flex-1 text-center"}
                  value={set.weight.toString()}
                  onChange={(newWeight) => handleWeightChange(set, newWeight)}
                />{" "}
              </div>
              {/* <ButtonComponent
              label="Show Previous"
              handleClick={() => setShowComparisonModal(!showComparisonModal)}
              customStyles="bg-orange-500 text-white"
            ></ButtonComponent> */}
            </div>
          ))}
        <ButtonComponent
          label="Show Previous"
          handleClick={() => setShowComparisonModal(!showComparisonModal)}
          isDisabled={comparisonExercise ? false : true}
          customStyles="bg-slate-400 text-white mt-4 p-2"
        ></ButtonComponent>
        {comparisonExercise && (
          <Modal showModal={showComparisonModal}>
            {comparisonExercise.periodSets.map((set, setIndex) => (
              <div
                key={set.periodSetId}
                className="w-full p-2 bg-slate-50 rounded-md m-1"
              >
                <div className="font-bold text-slate-600">
                  {"Set " + set.setNumber}
                </div>
                <div className="text-slate-500">Weight: {set.weight} lbs</div>

                <div className="text-slate-500">
                  Target Reps: {set.targetReps}
                </div>
                <div className="text-slate-500 font-bold">
                  Reps Performed: {set.actualReps}
                </div>
              </div>
            ))}
            <ButtonComponent
              label="Close"
              handleClick={() => setShowComparisonModal(!showComparisonModal)}
              customStyles="bg-orange-500 rounded-md p-1 text-white mt-4"
            ></ButtonComponent>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ExerciseDetails;
