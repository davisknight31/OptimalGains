import { useUser } from "@/app/contexts/UserContext";
import { Period } from "@/app/types/period";
import { PeriodExercise } from "@/app/types/periodExercise";
import { PeriodWorkout } from "@/app/types/periodWorkout";
import { Routine } from "@/app/types/routine";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { customBasicStyles } from "@/app/docs/PreferencesData";

interface PeriodOverviewProps {
  period?: Period;
  // refreshPeriods: () => void;
}

interface RoutineOption {
  label: string;
  value: Routine;
}

interface WorkoutOption {
  label: string;
  value: PeriodWorkout;
}

const PeriodOverview: React.FC<PeriodOverviewProps> = ({ period }) => {
  const { user, exercises } = useUser();
  const [workoutOptions, setWorkoutOptions] = useState<WorkoutOption[]>([]);
  const [associatedRoutine, setAssociatedRoutine] = useState<Routine>();
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutOption>();

  useEffect(() => {
    if (period) {
      setAssociatedRoutine(
        user?.routines?.find(
          (routine) => period?.routineId === routine.routineId
        )
      );
      console.log(period);
      createWorkoutOptions();
    }
  }, [period]);

  useEffect(() => {
    console.log(associatedRoutine?.workouts);
  }, [associatedRoutine]);

  function createWorkoutOptions(): void {
    const createdWorkoutOptions = period!.periodWorkouts.map(
      (periodWorkout) => {
        return { label: periodWorkout.periodWorkoutName, value: periodWorkout };
      }
    );
    const sortedWorkoutOptions = createdWorkoutOptions.sort(
      (a, b) =>
        new Date(b.value.date).getTime() - new Date(a.value.date).getTime()
    );
    setWorkoutOptions(sortedWorkoutOptions);
    setSelectedWorkout(sortedWorkoutOptions[0]);
  }

  function formatDate(date: string): string {
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString();
  }

  function findAssociatedExerciseId(periodExercise: PeriodExercise): number {
    // const workout = associatedRoutine!.workouts.find(
    //   (workout) =>
    //     workout.workoutExercises.find(
    //       (exercise) =>
    //         exercise.workoutExerciseId === periodExercise.workoutExerciseId
    //     )?.exerciseId
    // );
    // console.log(workout);
    // const workoutExercise = workout!.workoutExercises.find(
    //   (workoutExercise) =>
    //     workoutExercise.workoutExerciseId === periodExercise.workoutExerciseId
    // );

    const workoutExercise = associatedRoutine!.workouts
      .flatMap((workout) => workout.workoutExercises)
      .find(
        (exercise) =>
          exercise.workoutExerciseId === periodExercise.workoutExerciseId
      );

    return workoutExercise!.exerciseId;
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

    //

    //Edit the period name, length in weeks, associated routine
    //Only editable when the period is not active,
    //need to be able to updated associated routine,
    //the workouts part of that routine should be edited in the edit routines tab, so no need to do that
    <>
      <h1 className="text-3xl font-bold text-orange-500">Period Overview</h1>
      {period && (
        <div className="pt-4">
          {/* Routine Details */}
          <div className="mb-4">
            <label className="font-bold text-lg ">Period Name:&nbsp;</label>
            <span>{period.periodName}</span>
          </div>
          <div className="mb-4">
            <label className="font-bold text-lg ">
              Associated Routine:&nbsp;
            </label>
            <span>{associatedRoutine?.routineName}</span>
          </div>
          <div className="mb-4">
            <label className="font-bold text-lg ">
              Programmed Length:&nbsp;
            </label>
            <span>{period.lengthInWeeks} Weeks</span>
          </div>
          <div className="mb-4">
            <label className="font-bold text-lg ">Date Started:&nbsp;</label>
            <span>{formatDate(period.dateStarted.toString())}</span>
          </div>
          <div className="mb-4">
            <label className="font-bold text-lg">
              {!period.completed && !period.active
                ? "Date Stopped:"
                : "Date Completed:"}
              &nbsp;
            </label>
            <span>
              {period.active
                ? "Still Ongoing"
                : formatDate(period.dateStopped.toString())}
            </span>
          </div>
        </div>
      )}
      <h1 className="text-xl font-bold text-slate-500">View Workout</h1>
      {/* workout history list that lists all the workouts from the period, and allows the user to 
      select one and view its loads*/}
      <Select
        options={workoutOptions}
        value={selectedWorkout}
        onChange={(newValue) => {
          if (newValue) {
            setSelectedWorkout(newValue);
          }
        }}
        // styles={customBasicStyles}
      ></Select>
      {selectedWorkout?.value.periodExercises.map(
        (periodExercise, periodExerciseIndex) => (
          <div key={periodExercise.periodExerciseId}>
            {/* <div className="flex items-center gap-5"> */}
            {/* <div className="bg-slate-100 p-4 rounded-lg mb-7 flex justify-between items-center"> */}
            <div>
              <div className="font-bold text-slate-500 text-xl mt-4">
                {/* <span className="font-bold">Exercise: </span> */}
                {
                  exercises.find(
                    (exercise) =>
                      exercise.exerciseId ===
                      findAssociatedExerciseId(periodExercise)
                  )?.exerciseName
                }
              </div>
              {periodExercise?.periodSets.map((periodSet, periodSetIndex) => (
                <div key={periodSet.periodSetId} className="flex flex-col">
                  <div className="bg-slate-100 p-3 rounded-lg mb-4">
                    <div className="font-bold text-lg text-slate-500">
                      Set {periodSet.setNumber}
                    </div>
                    <div className="flex gap-3">
                      <div>
                        <span className="font-bold text-slate-500">
                          Weight:{" "}
                        </span>
                        <span className="font-bold">
                          {periodSet.weight} lbs
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">
                          Actual Reps:{" "}
                        </span>
                        <span className="font-bold">
                          {periodSet.actualReps}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">
                          Target Reps:{" "}
                        </span>
                        <span className="font-bold">
                          {periodSet.targetReps}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default PeriodOverview;
