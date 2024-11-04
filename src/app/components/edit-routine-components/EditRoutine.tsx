import React, { useEffect, useRef, useState } from "react";
import { Routine } from "@/app/types/routine";
import Input from "../shared-components/Input";
import Spinner from "../shared-components/Spinner";
import { Workout } from "@/app/types/workout";
import Select from "react-select";
import { useUser } from "@/app/contexts/UserContext";
import { customBasicStyles, inputStyles } from "@/app/docs/PreferencesData";
import { Exercise } from "@/app/types/exercise";
import { WorkoutExercise } from "@/app/types/workoutExercise";
import { NewWorkoutExercise } from "@/app/types/newWorkoutExercise";
import { NewWorkout } from "@/app/types/newWorkout";
import trashIcon from "../../assets/trashIcon_Black.png";
import Image from "next/image";
import ErrorCard from "../shared-components/ErrorCard";
import {
  createRoutine,
  deleteWorkoutExercises,
  deleteWorkouts,
  updateRoutine,
} from "@/app/services/apiService";
import CoverSpinner from "../shared-components/CoverSpinner";
import { navigateRoutines } from "@/app/utils/navigationActions";
import SuccessModal from "../shared-components/SuccessModal";
import _ from "lodash";
import ButtonComponent from "../shared-components/Button";

interface EditRoutineProps {
  routine?: Routine;
  refreshRoutines: () => Promise<void>;
}

interface GroupedExercisesOption {
  label: string;
  options: ExerciseOption[];
}

interface ExerciseOption {
  label: string;
  value: Exercise;
  groupLabel: string;
}

interface TargetMuscleOption {
  label: string;
  value: string;
}

// const targetMuscleOptions: TargetMuscleOption[] = [
//   { value: "All", label: "All" },
//   { value: "Chest", label: "Chest" },
//   { value: "Triceps", label: "Triceps" },
//   { value: "Front Delts", label: "Front Delts" },
//   { value: "Side Delts", label: "Side Delts" },
//   { value: "Rear Delts", label: "Rear Delts" },
//   { value: "Back", label: "Back" },
//   { value: "Biceps", label: "Biceps" },
//   { value: "Traps", label: "Traps" },
//   { value: "Forearms", label: "Forearms" },
//   { value: "Legs", label: "Legs" },
// ];

const customFilterOption = (
  candidate: { label: string; value: any; data: ExerciseOption },
  input: string
) => {
  const searchTerm = input.toLowerCase();

  const exerciseNameMatch = candidate.label.toLowerCase().includes(searchTerm);
  const groupLabelMatch = candidate.data.groupLabel
    .toLowerCase()
    .includes(searchTerm);

  return exerciseNameMatch || groupLabelMatch;
};

const EditRoutine: React.FC<EditRoutineProps> = ({
  routine,
  refreshRoutines,
}) => {
  const { user, exercises } = useUser();
  const [routineName, setRoutineName] = useState<string>("");
  const [lengthInDays, setLengthInDays] = useState<string>("");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [inputSets, setInputSets] = useState<{ [key: string]: string }>({});
  const [inputReps, setInputReps] = useState<{ [key: string]: string }>({});

  const [groupedExerciseOptions, setGroupedExerciseOptions] = useState<
    GroupedExercisesOption[]
  >([]);
  const [workoutsToDelete, setWorkoutsToDelete] = useState<number[]>([]);
  const [workoutExercisesToDelete, setWorkoutExercisesToDelete] = useState<
    number[]
  >([]);
  const [newWorkoutKeyCounter, setNewWorkoutKeyCounter] = useState<number>(0);
  const [newExerciseKeyCounter, setNewExerciseKeyCounter] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [noExercisesText, setNoExercisesText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmationText, setConfirmationText] = useState<string>("");
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] =
    useState<boolean>(true);

  const initialWorkoutsRef = useRef<Workout[] | null>(null);
  const initialRoutineName = useRef<string>("");
  const initialRoutineLength = useRef<string>("");

  useEffect(() => {
    const groupedExercises = createGroupedExercisesList();
    setGroupedExerciseOptions(groupedExercises);
  }, [exercises]);

  useEffect(() => {
    if (routine) {
      setRoutineName(routine.routineName);
      setLengthInDays(routine.lengthInDays.toString());
      setWorkouts(routine.workouts || []);
      initialWorkoutsRef.current = JSON.parse(
        JSON.stringify(routine.workouts)
      ).sort(
        (a: Workout, b: Workout) => a.positionInRoutine - b.positionInRoutine
      );
      if (initialWorkoutsRef.current) {
        initialWorkoutsRef.current.forEach((workout: Workout) => {
          workout.workoutExercises.sort(
            (a: WorkoutExercise, b: WorkoutExercise) =>
              a.positionInWorkout - b.positionInWorkout
          );
        });
      }

      initialRoutineName.current = routine.routineName;
      initialRoutineLength.current = routine.lengthInDays.toString();

      setConfirmationText("Routine Updated!");
    } else {
      // const emptyWorkouts = Array.from({ length: 7 }).map(() => emptyWorkout);
      // setWorkouts(emptyWorkouts);
      setConfirmationText("Routine Created!");
    }
  }, [routine]);

  useEffect(() => {
    if (routine) {
      if (initialWorkoutsRef.current) {
        const sortedWorkouts = JSON.parse(JSON.stringify(workouts)).sort(
          (a: Workout, b: Workout) => a.positionInRoutine - b.positionInRoutine
        );
        //isNotModified is true if the two are equal, otherwise isNotModified is false
        const isNotModified = _.isEqual(
          sortedWorkouts,
          initialWorkoutsRef.current
        );

        const isValid = validate();
        if (isValid) {
          setIsSubmitButtonDisabled(isNotModified);
        }
      }
      if (
        routineName !== initialRoutineName.current ||
        lengthInDays !== initialRoutineLength.current
      ) {
        const isValid = validate();
        if (isValid) {
          setIsSubmitButtonDisabled(false);
        }
      }
    } else {
      const isValid = validate();
      console.log(isValid);
      setIsSubmitButtonDisabled(!isValid);
      // const allNames = workouts.flatMap((workout) => workout.workoutName);

      // const workoutExercises = workouts.flatMap(
      //   (workout) => workout.workoutExercises
      // );
      // const zeroValueExerciseId = workoutExercises.find(
      //   (exercise) => exercise.exerciseId === 0
      // );

      // const allSets = Object.values(inputSets);
      // const allReps = Object.values(inputReps);

      // const emptyNameValue = allNames.find((name) => name === "");
      // const emptySetsValue = allSets.find((set) => set === "");
      // const emptyRepsValue = allReps.find((rep) => rep === "");

      // const hasZeroExerciseIdValue =
      //   zeroValueExerciseId?.exerciseId === 0 ? true : false;
      // const hasEmptyNameValue = emptyNameValue === "" ? true : false;
      // const hasEmptySetsValue = emptySetsValue === "" ? true : false;
      // const hasEmptyRepsValue = emptyRepsValue === "" ? true : false;

      // if (
      //   routineName &&
      //   lengthInDays &&
      //   !hasEmptyNameValue &&
      //   !hasZeroExerciseIdValue &&
      //   !hasEmptySetsValue &&
      //   !hasEmptyRepsValue
      // ) {
      //   setIsSubmitButtonDisabled(false);
      // } else {
      //   setIsSubmitButtonDisabled(true);
      // }
    }
  }, [workouts, routineName, lengthInDays]);

  function validate(): boolean {
    const allNames = workouts.flatMap((workout) => workout.workoutName);

    const workoutExercises = workouts.flatMap(
      (workout) => workout.workoutExercises
    );
    const zeroValueExerciseId = workoutExercises.find(
      (exercise) => exercise.exerciseId === 0
    );

    //need to flat map reps and sets and check NaN
    const workoutExerciseSets = workoutExercises.flatMap(
      (workoutExercise) => workoutExercise.sets
    );
    const workoutExerciseReps = workoutExercises.flatMap(
      (workoutExercise) => workoutExercise.targetReps
    );

    const allSets = Object.values(inputSets);
    const allReps = Object.values(inputReps);

    const emptyNameValue = allNames.find((name) => name === "");
    const emptySetsValue = allSets.find((set) => set === "");
    const emptyRepsValue = allReps.find((rep) => rep === "");
    const nanSetsValue = workoutExerciseSets.find((sets) => Number.isNaN(sets));
    const nanRepsValue = workoutExerciseReps.find((reps) => Number.isNaN(reps));

    const hasZeroExerciseIdValue =
      zeroValueExerciseId?.exerciseId === 0 ? true : false;
    const hasWorkouts = workouts.length > 0 ? true : false;
    const hasEmptyNameValue = emptyNameValue === "" ? true : false;
    const hasEmptySetsValue = emptySetsValue === "" ? true : false;
    const hasEmptyRepsValue = emptyRepsValue === "" ? true : false;
    const hasNaNSetsValue = Number.isNaN(nanSetsValue) ? true : false;
    const hasNaNRepsValue = Number.isNaN(nanRepsValue) ? true : false;

    if (
      routineName &&
      lengthInDays &&
      hasWorkouts &&
      !hasEmptyNameValue &&
      !hasZeroExerciseIdValue &&
      !hasEmptySetsValue &&
      !hasEmptyRepsValue &&
      !hasNaNSetsValue &&
      !hasNaNRepsValue
    ) {
      return true;
    } else {
      return false;
    }
  }

  function createGroupedExercisesList(): GroupedExercisesOption[] {
    const groupedOptions: GroupedExercisesOption[] = exercises.reduce(
      (groups: GroupedExercisesOption[], exercise) => {
        const group = groups.find(
          (g) => g.label === exercise.targetMuscleGroup
        );

        //maybe eventually do leg filtering

        const exerciseOption: ExerciseOption = {
          label: exercise.exerciseName,
          value: exercise,
          groupLabel: exercise.targetMuscleGroup.includes("Delts")
            ? exercise.targetMuscleGroup + " | Shoulders"
            : exercise.targetMuscleGroup,
        };

        if (group) {
          group.options.push(exerciseOption);
        } else {
          groups.push({
            label: exercise.targetMuscleGroup,
            options: [exerciseOption],
          });
        }

        return groups;
      },
      []
    );
    return groupedOptions;
  }

  const handleRoutineNameChange = (value: string) => {
    setRoutineName(value);
  };

  const handleLengthInDaysChange = (value: string) => {
    const flooredValue = Math.floor(parseInt(value));
    flooredValue > 8 || flooredValue < 1
      ? setLengthInDays(lengthInDays)
      : setLengthInDays(flooredValue.toString());

    flooredValue < workouts.length
      ? setErrorMessage(
          "Length in days cannot be less than the number of workouts."
        )
      : setErrorMessage("");
  };

  const handleWorkoutNameChange = (index: number, newName: string) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout, i) =>
        i === index ? { ...workout, workoutName: newName } : workout
      )
    );
  };

  const handleExerciseChange = (
    exerciseIndex: number,
    workoutIndex: number,
    selectedExercise: Exercise
  ) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout, i) => {
        //if the workout being edited matches the current index
        if (i === workoutIndex) {
          //being mapping workoutExercises
          const updatedExercises = workout.workoutExercises.map(
            (exercise, j) => {
              // if the exercise being edited matches the current index
              if (j === exerciseIndex) {
                //then return the exercise, with the modified sets
                return {
                  ...exercise,
                  exerciseId: selectedExercise.exerciseId,
                };
              }
              //if the exercise indexes don't match, just return the exercise
              return exercise;
            }
          );
          //return the workout with the modified exercise
          return { ...workout, workoutExercises: updatedExercises };
        }
        //if the workout indexes don't match, just return the workout.
        return workout;
      })
    );
  };

  const handleExerciseSetsChange = (
    exerciseIndex: number,
    workoutIndex: number,
    newSets: string
  ) => {
    if (parseInt(newSets) > 10 || parseInt(newSets) < 1) {
      newSets = inputSets[`${workoutIndex}-${exerciseIndex}`];
    }

    setInputSets((prevInputs) => ({
      ...prevInputs,
      [`${workoutIndex}-${exerciseIndex}`]: newSets, // Use a unique key per exercise input
    }));

    // If the new value is empty, don't update the state
    // if (newSets === "") {
    //   return;
    // }

    // Parse and check for valid numbers
    // const parsedSets = parseInt(newSets, 10);
    // if (isNaN(parsedSets) || parsedSets < 0) {
    //   return;
    // }
    //begins mapping previous workouts
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout, i) => {
        //if the workout being edited matches the current index
        if (i === workoutIndex) {
          //being mapping workoutExercises
          const updatedExercises = workout.workoutExercises.map(
            (exercise, j) => {
              // if the exercise being edited matches the current index
              if (j === exerciseIndex) {
                //then return the exercise, with the modified sets
                return {
                  ...exercise,
                  sets: parseInt(newSets),
                };
              }
              //if the exercise indexes don't match, just return the exercise
              return exercise;
            }
          );
          //return the workout with the modified exercise
          return { ...workout, workoutExercises: updatedExercises };
        }
        //if the workout indexes don't match, just return the workout.
        return workout;
      })
    );
  };

  const handleExerciseRepsChange = (
    exerciseIndex: number,
    workoutIndex: number,
    newReps: string
  ) => {
    if (parseInt(newReps) > 50 || parseInt(newReps) < 1) {
      newReps = inputReps[`${workoutIndex}-${exerciseIndex}`];
    }

    setInputReps((prevInputs) => ({
      ...prevInputs,
      [`${workoutIndex}-${exerciseIndex}`]: newReps, // Use a unique key per exercise input
    }));

    // If the new value is empty, don't update the state
    if (newReps === "") {
      //commented out because we want the empty values for validating
      //and updating submit button disabled
      // return;
    }

    // Parse and check for valid numbers
    //commented out because we want the empty values for validating
    //and updating submit button disabled
    // const parsedReps = parseInt(newReps, 10);
    // if (isNaN(parsedReps) || parsedReps < 0) {
    //   return;
    // }
    //begins mapping previous workouts
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout, i) => {
        //if the workout being edited matches the current index
        if (i === workoutIndex) {
          //being mapping workoutExercises
          const updatedExercises = workout.workoutExercises.map(
            (exercise, j) => {
              // if the exercise being edited matches the current index
              if (j === exerciseIndex) {
                //then return the exercise, with the modified sets
                return {
                  ...exercise,
                  targetReps: parseInt(newReps),
                };
              }
              //if the exercise indexes don't match, just return the exercise
              return exercise;
            }
          );
          //return the workout with the modified exercise
          return { ...workout, workoutExercises: updatedExercises };
        }
        //if the workout indexes don't match, just return the workout.
        return workout;
      })
    );
  };

  function swapWorkouts(
    workoutIndexOne: number,
    workoutIndexTwo: number,
    workoutPositionOne: number,
    workoutPositionTwo: number
  ): void {
    const updatedWorkouts = [...workouts];

    updatedWorkouts[workoutIndexOne].positionInRoutine = workoutPositionTwo;
    updatedWorkouts[workoutIndexTwo].positionInRoutine = workoutPositionOne;

    setWorkouts([...updatedWorkouts]);
  }

  function swapExercises(
    workoutIndex: number,
    exerciseIndexOne: number,
    exerciseIndexTwo: number,
    exercisePositionOne: number,
    exercisePositionTwo: number
  ): void {
    const updatedWorkouts = [...workouts];

    updatedWorkouts[workoutIndex].workoutExercises[
      exerciseIndexOne
    ].positionInWorkout = exercisePositionTwo;

    updatedWorkouts[workoutIndex].workoutExercises[
      exerciseIndexTwo
    ].positionInWorkout = exercisePositionOne;

    setWorkouts([...updatedWorkouts]);
  }

  function addExerciseToWorkout(workout: Workout): void {
    setNoExercisesText("");
    if (workout.workoutId) {
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((mappedWorkout, i) => {
          if (mappedWorkout.workoutId === workout.workoutId) {
            setNewExerciseKeyCounter(newExerciseKeyCounter + 1);
            const maxPosition = Math.max(
              ...mappedWorkout.workoutExercises.map(
                (exercise) => exercise.positionInWorkout
              )
            );

            return {
              ...mappedWorkout,
              workoutExercises: [
                ...(mappedWorkout.workoutExercises || []),
                {
                  workoutExerciseId: undefined,
                  uniqueKey: newExerciseKeyCounter,
                  workoutId: workout.workoutId || undefined,
                  exerciseId: 0,
                  sets: NaN,
                  targetReps: NaN,
                  positionInWorkout:
                    maxPosition === -Infinity ? 1 : maxPosition + 1,
                },
              ],
            };
          }
          return mappedWorkout;
        })
      );
    } else {
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((mappedWorkout, i) => {
          if (mappedWorkout.uniqueKey === workout.uniqueKey) {
            setNewExerciseKeyCounter(newExerciseKeyCounter + 1);
            const maxPosition = Math.max(
              ...mappedWorkout.workoutExercises.map(
                (exercise) => exercise.positionInWorkout
              )
            );

            return {
              ...mappedWorkout,
              workoutExercises: [
                ...(mappedWorkout.workoutExercises || []),
                {
                  workoutExerciseId: undefined,
                  uniqueKey: newExerciseKeyCounter,
                  workoutId: workout.workoutId || undefined,
                  exerciseId: 0,
                  sets: 0,
                  targetReps: 0,
                  positionInWorkout:
                    maxPosition === -Infinity ? 1 : maxPosition + 1,
                },
              ],
            };
          }
          return mappedWorkout;
        })
      );
    }
  }

  function addWorkout(restDay: boolean): void {
    setErrorMessage("");
    const maxPosition = Math.max(
      ...workouts.map((workout) => workout.positionInRoutine)
    );
    if (workouts.length < parseInt(lengthInDays)) {
      setWorkouts([
        ...workouts,
        {
          workoutId: undefined,
          uniqueKey: newWorkoutKeyCounter,
          workoutName: restDay ? "Rest Day" : "",
          positionInRoutine: maxPosition === -Infinity ? 1 : maxPosition + 1,
          workoutExercises: [],
        },
      ]);

      setNewWorkoutKeyCounter(newWorkoutKeyCounter + 1);
    } else {
      setErrorMessage(
        "Number of workouts must match the length in days of the routine."
      );
    }
  }

  function removeExerciseFromWorkout(
    workoutIndex: number,
    workoutExerciseIndex: number,
    exercise: WorkoutExercise //This is the actual id to remove from the datbase
  ): void {
    if (exercise.workoutExerciseId) {
      setWorkoutExercisesToDelete([
        ...workoutExercisesToDelete,
        exercise.workoutExerciseId,
      ]);
    }
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout, i) =>
        i === workoutIndex
          ? {
              ...workout,
              workoutExercises: workout.workoutExercises
                .filter((exercise, j) => j !== workoutExerciseIndex)
                .map((exercise, index) => ({
                  ...exercise,
                  positionInWorkout: index + 1,
                })),
            }
          : workout
      )
    );
  }

  function removeWorkout(workout: Workout): void {
    //if it is existing (has a workoutId from the database) add to ids to remove from database
    //if it doesnt have a workoutid, dont need to add anything, just remove the workout from frontend list
    setErrorMessage("");
    if (workout.workoutId) {
      setWorkoutsToDelete([...workoutsToDelete, workout.workoutId]);

      setWorkouts((prevWorkouts) =>
        prevWorkouts
          .filter(
            (iteratedWorkout) => iteratedWorkout.workoutId !== workout.workoutId
          )
          .map((workoutFromMap, index) => ({
            ...workoutFromMap,
            positionInRoutine: index + 1,
          }))
      );

      const exerciseIdsToRemoveFromDatabase = workout.workoutExercises
        .map((exercise) => exercise.workoutExerciseId)
        .filter((id): id is number => id !== undefined);

      setWorkoutExercisesToDelete([
        ...workoutExercisesToDelete,
        ...exerciseIdsToRemoveFromDatabase,
      ]);
    } else {
      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter(
          (iteratedWorkout) => iteratedWorkout.uniqueKey !== workout.uniqueKey
        )
      );
    }
  }

  const submitUpdate = async () => {
    if (workouts.length !== parseInt(lengthInDays)) {
      setErrorMessage(
        "Number of workouts must, at most, match the length of the routine."
      );
    } else if (
      workouts.find(
        (workout) =>
          workout.workoutExercises.length <= 0 &&
          workout.workoutName !== "Rest Day"
      )
    ) {
      setNoExercisesText(
        "Please make sure all workouts have at least one exercise."
      );
    } else {
      setIsSubmitting(true);
      if (routine) {
        await updateRoutine(
          routine.routineId,
          routineName,
          lengthInDays,
          workouts
        );
      }

      if (workoutExercisesToDelete) {
        await deleteWorkoutExercises(workoutExercisesToDelete);
      }

      if (workoutsToDelete) {
        await deleteWorkouts(workoutsToDelete);
      }

      await refreshRoutines();

      setShowConfirmationModal(true);
    }
  };

  const submitCreation = async () => {
    if (workouts.length !== parseInt(lengthInDays)) {
      setErrorMessage(
        "Number of workouts must match the length in days of the routine."
      );
    } else if (
      workouts.find((workout) => workout.workoutExercises.length <= 0)
    ) {
      setNoExercisesText(
        "Please make sure all workouts have at least one exercise."
      );
    } else {
      setIsSubmitting(true);
      if (user) {
        await createRoutine(user?.userId, routineName, lengthInDays, workouts);
      }

      await refreshRoutines();

      setShowConfirmationModal(true);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <CoverSpinner />}
      {showConfirmationModal && (
        <SuccessModal
          showModal={showConfirmationModal}
          successText={confirmationText}
          navigateFunction={navigateRoutines}
        />
      )}
      {routine ? (
        <h1 className="text-2xl font-bold text-orange-500 text-center">
          Editing Routine
        </h1>
      ) : (
        <h1 className="text-2xl font-bold text-orange-500 text-center">
          Creating Routine
        </h1>
      )}

      <div className="p-4">
        {/* <div>
          <span className="font-bold">*Disclaimer: </span> Do
          <span className="font-bold"> NOT </span> include rest days. A routine
          is done
          <span className="font-bold"> ONCE </span> per week.<br></br>
          <br></br>This means that if you set the length to
          <span className="font-bold"> 5 days</span>, then the routine would be
          <span className="font-bold"> 5 workouts</span> and
          <span className="font-bold"> 2 rest days</span> of your choosing,
          equalling a total of <span className="font-bold">7 days.</span>
          <br></br>
          <br></br>We leave rest days up to you to decide on at any point,
          incase you need to move them around. This is done to ensure that the
          routine will fit evenly in a period. You may still choose a length
          longer than 7 days, but keep in mind this will not workout with a
          period.<br></br>
          <br></br>
        </div> */}
        {/* Routine Details */}
        <div className="mb-4">
          <label className="font-bold text-lg block">Routine Name:</label>
          <Input
            placeholder="Routine Name"
            type="text"
            styles={inputStyles}
            onChange={handleRoutineNameChange}
            value={routineName}
          />
        </div>
        <div className="mb-4">
          <label className="font-bold text-lg block">Length in Days:</label>
          <Input
            placeholder="Length In Days"
            type="number"
            styles={inputStyles}
            onChange={handleLengthInDaysChange}
            value={lengthInDays}
          />
        </div>

        {/* Workouts Section */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-300">Workouts</h2>
          {workouts
            .sort((a, b) => a.positionInRoutine - b.positionInRoutine)
            .map((workout, workoutIndex) => (
              <div key={workout.workoutId || `${workout.uniqueKey}`}>
                {/* Workout Card */}
                <div className="bg-slate-50 p-4 rounded-lg mb-7">
                  <div className="flex flex-col ">
                    <span className="font-bold">Name:</span>
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="Name"
                        type="text"
                        styles={inputStyles}
                        onChange={(newName) =>
                          handleWorkoutNameChange(workoutIndex, newName)
                        }
                        value={workout.workoutName}
                      />
                      <button
                        onClick={() =>
                          swapWorkouts(
                            workoutIndex,
                            workoutIndex - 1,
                            workout.positionInRoutine,
                            workout.positionInRoutine - 1
                          )
                        }
                        disabled={workoutIndex === 0}
                        className={`${
                          workoutIndex === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        } p-1 font-bold text-xl border rounded-full bg-white `}
                      >
                        &nbsp;↑&nbsp;
                      </button>
                      <button
                        onClick={() =>
                          swapWorkouts(
                            workoutIndex,
                            workoutIndex + 1,
                            workout.positionInRoutine,
                            workout.positionInRoutine + 1
                          )
                        }
                        disabled={workoutIndex === workouts.length - 1}
                        className={`${
                          workoutIndex === workouts.length - 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        } p-1 font-bold text-xl border rounded-full bg-white`}
                      >
                        &nbsp;↓&nbsp;
                      </button>
                      <div className="flex gap-2 flex-grow justify-end">
                        <img
                          className="hover:cursor-pointer "
                          src={trashIcon.src}
                          width="32px"
                          alt="delete"
                          onClick={() => removeWorkout(workout)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Exercise List */}
                  {workout.workoutExercises
                    .sort((a, b) => a.positionInWorkout - b.positionInWorkout)
                    .map((exercise, exerciseIndex) => (
                      <div
                        key={
                          exercise.workoutExerciseId ||
                          `${workout.uniqueKey}-${exercise.uniqueKey}`
                        }
                        className="p-2 rounded-lg flex justify-between items-center"
                      >
                        <div className="flex items-center gap-5">
                          <span className="font-bold">
                            Exercise:<br></br>
                            <Select
                              options={groupedExerciseOptions}
                              value={groupedExerciseOptions
                                .find((group) =>
                                  group.options.find(
                                    (option) =>
                                      option.value.exerciseId ===
                                      exercise.exerciseId
                                  )
                                )
                                ?.options.find(
                                  (option) =>
                                    option.value.exerciseId ===
                                    exercise.exerciseId
                                )}
                              styles={customBasicStyles}
                              onChange={(newValue) => {
                                if (newValue) {
                                  handleExerciseChange(
                                    exerciseIndex,
                                    workoutIndex,
                                    newValue.value
                                  );
                                }
                              }}
                              filterOption={customFilterOption}
                            ></Select>
                          </span>
                          <span className="font-bold">
                            Sets:<br></br>
                            <Input
                              placeholder="Sets"
                              type="number"
                              styles={inputStyles + " w-16"}
                              onChange={(newSets) =>
                                handleExerciseSetsChange(
                                  exerciseIndex,
                                  workoutIndex,
                                  newSets
                                )
                              }
                              value={
                                inputSets[`${workoutIndex}-${exerciseIndex}`] ??
                                exercise.sets.toString()
                              }
                            />
                          </span>
                          <span className="font-bold">
                            Reps:<br></br>
                            <Input
                              placeholder="Reps"
                              type="number"
                              styles={inputStyles + " w-16"}
                              onChange={(newReps) =>
                                handleExerciseRepsChange(
                                  exerciseIndex,
                                  workoutIndex,
                                  newReps
                                )
                              }
                              value={
                                inputReps[`${workoutIndex}-${exerciseIndex}`] ??
                                exercise.targetReps.toString()
                              }
                            />
                          </span>
                          <div className="flex gap-2">
                            <ButtonComponent
                              label="↑"
                              customStyles="p-3 text-md mt-4 rounded-md bg-slate-200 text-slate-700 disabled:bg-slate-100"
                              handleClick={() =>
                                swapExercises(
                                  workoutIndex,
                                  exerciseIndex,
                                  exerciseIndex - 1,
                                  exercise.positionInWorkout,
                                  exercise.positionInWorkout - 1
                                )
                              }
                              isDisabled={exerciseIndex === 0}
                            ></ButtonComponent>
                            <ButtonComponent
                              label="↓"
                              customStyles="p-3 text-md mt-4 rounded-md bg-slate-200 text-slate-700 disabled:bg-slate-100"
                              handleClick={() =>
                                swapExercises(
                                  workoutIndex,
                                  exerciseIndex,
                                  exerciseIndex + 1,
                                  exercise.positionInWorkout,
                                  exercise.positionInWorkout + 1
                                )
                              }
                              isDisabled={
                                exerciseIndex ===
                                workout.workoutExercises.length - 1
                              }
                            ></ButtonComponent>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <ButtonComponent
                            label="Remove"
                            customStyles="p-3 text-sm mt-4 rounded-md bg-slate-200 text-slate-700"
                            handleClick={() =>
                              removeExerciseFromWorkout(
                                workoutIndex,
                                exerciseIndex,
                                exercise
                              )
                            }
                          ></ButtonComponent>
                        </div>
                      </div>
                    ))}

                  {/* Add Exercise Button */}
                  {workout.workoutName !== "Rest Day" && (
                    <ButtonComponent
                      label="Add Exercise"
                      handleClick={() => addExerciseToWorkout(workout)}
                      customStyles="p-2 mt-4 text-slate-700 bg-slate-200 hover:bg-slate-200 hover:text-slate-600 "
                    />
                  )}
                </div>
              </div>
            ))}

          {/* Add Workout Button */}
          <div className="flex gap-5">
            <ButtonComponent
              label="Add Rest Day"
              handleClick={() => addWorkout(true)}
              customStyles="p-3 mt-4 text-white bg-orange-500 hover:bg-orange-400"
            />
            <ButtonComponent
              label="Add Workout"
              handleClick={() => addWorkout(false)}
              customStyles="p-3 mt-4 text-white bg-orange-500 hover:bg-orange-400"
            />
          </div>
        </div>
      </div>
      <div className="text-red-600 font-bold text-center">{errorMessage}</div>
      <div className="text-red-600 font-bold text-center">
        {noExercisesText}
      </div>

      {/* Submit Section */}
      <div className="pt-5 text-center">
        {routine ? (
          <ButtonComponent
            label="Update"
            handleClick={submitUpdate}
            isDisabled={isSubmitButtonDisabled}
            customStyles="p-3 text-white bg-orange-500 hover:bg-orange-400 disabled:bg-orange-200 disabled:cursor-not-allowed"
          />
        ) : (
          <ButtonComponent
            label="Create"
            handleClick={submitCreation}
            isDisabled={isSubmitButtonDisabled}
            customStyles="p-3 text-white bg-orange-500 hover:bg-orange-400"
          />
        )}
      </div>
    </>
  );
};
export default EditRoutine;
