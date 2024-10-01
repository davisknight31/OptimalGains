import React, { useEffect, useState } from "react";
import Button from "../shared-components/Button";
import { testLog } from "@/app/utils/helpers";
import { Routine } from "@/app/types/routine";
import Input from "../shared-components/Input";
import Spinner from "../shared-components/Spinner";
import { Workout } from "@/app/types/workout";
import Select from "react-select";
import { useUser } from "@/app/contexts/UserContext";
import { customBasicStyles } from "@/app/docs/PreferencesData";
import { Exercise } from "@/app/types/exercise";
import { WorkoutExercise } from "@/app/types/workoutExercise";
import { NewWorkoutExercise } from "@/app/types/newWorkoutExercise";
import { NewWorkout } from "@/app/types/newWorkout";
import trashIcon from "../../assets/trashIcon_Black.png";
import Image from "next/image";
import ErrorCard from "../shared-components/ErrorCard";
import { updateRoutine } from "@/app/services/apiService";
import CoverSpinner from "../shared-components/CoverSpinner";
import { navigateRoutines } from "@/app/utils/navigationActions";

interface EditRoutineProps {
  routine?: Routine;
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

const targetMuscleOptions: TargetMuscleOption[] = [
  { value: "All", label: "All" },
  { value: "Chest", label: "Chest" },
  { value: "Triceps", label: "Triceps" },
  { value: "Front Delts", label: "Front Delts" },
  { value: "Side Delts", label: "Side Delts" },
  { value: "Rear Delts", label: "Rear Delts" },
  { value: "Back", label: "Back" },
  { value: "Biceps", label: "Biceps" },
  { value: "Traps", label: "Traps" },
  { value: "Forearms", label: "Forearms" },
  { value: "Legs", label: "Legs" },
];

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

const EditRoutine: React.FC<EditRoutineProps> = ({ routine }) => {
  const { exercises } = useUser();
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [routineName, setRoutineName] = useState<string>("");
  const [lengthInDays, setLengthInDays] = useState<string>("");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [inputSets, setInputSets] = useState<{ [key: string]: string }>({});
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const inputStyles: string =
    "p-1 rounded-lg bg-transparent border-2 border-slate-100 placeholder-slate-400 focus:outline-0";

  useEffect(() => {
    setFilteredExercises(exercises);
    const groupedExercises = createGroupedExercisesList();
    setGroupedExerciseOptions(groupedExercises);
  }, []);

  useEffect(() => {
    if (routine) {
      setRoutineName(routine.routineName);
      setLengthInDays(routine.lengthInDays.toString());
      setWorkouts(routine.workouts || []);
    }
  }, [routine]);
  useEffect(() => {
    console.log("workouts updated:", workouts);
  }, [workouts]);

  useEffect(() => {
    console.log("length: ", lengthInDays);
  }, [lengthInDays]);

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
    console.log(lengthInDays);
    const flooredValue = Math.floor(parseInt(value));
    flooredValue > 8 || flooredValue < 1
      ? setLengthInDays(lengthInDays)
      : setLengthInDays(flooredValue.toString());
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
      console.log(newSets);
    }

    setInputSets((prevInputs) => ({
      ...prevInputs,
      [`${workoutIndex}-${exerciseIndex}`]: newSets, // Use a unique key per exercise input
    }));

    // If the new value is empty, don't update the state
    if (newSets === "") {
      return;
    }

    // Parse and check for valid numbers
    const parsedSets = parseInt(newSets, 10);
    if (isNaN(parsedSets) || parsedSets < 0) {
      return;
    }
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
    if (workout.workoutId) {
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((mappedWorkout, i) => {
          if (mappedWorkout.workoutId === workout.workoutId) {
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
                  positionInWorkout:
                    maxPosition === -Infinity ? 1 : maxPosition + 1,
                },
              ],
            };
          }

          setNewExerciseKeyCounter(newExerciseKeyCounter + 1);
          return mappedWorkout;
        })
      );
    } else {
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((mappedWorkout, i) => {
          if (mappedWorkout.uniqueKey === workout.uniqueKey) {
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
                  positionInWorkout:
                    maxPosition === -Infinity ? 1 : maxPosition + 1,
                },
              ],
            };
          }

          setNewExerciseKeyCounter(newExerciseKeyCounter + 1);
          return mappedWorkout;
        })
      );
    }
  }

  //need to add an empty workoutExercise to the workout where add exercise was clicked ^^^

  function addWorkout(): void {
    setErrorMessage("");
    if (workouts.length < parseInt(lengthInDays)) {
      setWorkouts([
        ...workouts,
        {
          workoutId: undefined,
          uniqueKey: newWorkoutKeyCounter,
          workoutName: "",
          positionInRoutine:
            Math.max(...workouts.map((workout) => workout.positionInRoutine)) +
            1,
          workoutExercises: [],
        },
      ]);

      setNewWorkoutKeyCounter(newWorkoutKeyCounter + 1);
    } else {
      setErrorMessage(
        "Number of workouts must, at most, match the length of the routine."
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

  const log = () => {
    //update first
    // console.log(routineName);
    if (workouts.length > parseInt(lengthInDays)) {
      setErrorMessage(
        "Number of workouts must, at most, match the length of the routine."
      );
    } else {
      setIsSubmitting(true);
      if (routine) {
        updateRoutine(routine.routineId, routineName, lengthInDays, workouts);
        //^ This already waits to finish

        //show the modal which will contain this button to confirm and move on
        navigateRoutines();
      }

      //delete after, to ensure values for the routine exist still, if that even matters
      console.log(
        "Existing Workout Exercises to Delete: ",
        workoutExercisesToDelete
      );

      console.log("Existing Workouts to Delete", workoutsToDelete);
    }
  };

  if (!routine) {
    return (
      <>
        <h1 className="text-3xl font-bold text-orange-500">Creating</h1>
        <table>
          <tbody>
            <tr>
              <td className="p-3 pl-0">
                <label className="font-bold text-lg">Routine Name</label>
              </td>
              <td className="p-3">
                <Input
                  placeholder="Routine Name"
                  type="text"
                  styles={inputStyles}
                  onChange={handleRoutineNameChange}
                  value={routineName}
                ></Input>
              </td>
            </tr>
            <tr>
              <td className="p-3 pl-0">
                <label className="font-bold text-lg">Length In Days</label>
              </td>
              <td className="p-3">
                <Input
                  placeholder="Length In Days"
                  type="number"
                  styles={inputStyles}
                  onChange={handleLengthInDaysChange}
                  value={lengthInDays}
                ></Input>
              </td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  if (routine) {
    return (
      <>
        {isSubmitting && <CoverSpinner></CoverSpinner>}
        <h1 className="text-3xl font-bold text-orange-500">Editing</h1>
        <table className="border-collapse">
          <tbody>
            <tr>
              <td className="p-3 pl-0">
                <label className="font-bold text-lg">Routine Name</label>
              </td>
              <td className="p-3 border-b-black">
                <Input
                  placeholder="Routine Name"
                  type="text"
                  styles={inputStyles}
                  onChange={handleRoutineNameChange}
                  value={routineName}
                ></Input>
              </td>
            </tr>
            <tr>
              <td className="p-3 pl-0">
                <label className="font-bold text-lg">Length In Days</label>
              </td>
              <td className="p-3">
                <Input
                  placeholder="Length In Days"
                  type="number"
                  styles={inputStyles}
                  onChange={handleLengthInDaysChange}
                  value={lengthInDays}
                ></Input>
              </td>
            </tr>
            <tr>
              <td>
                <h1 className="text-2xl font-bold text-slate-300">Workouts</h1>
              </td>
            </tr>
            {workouts
              .sort((a, b) => a.positionInRoutine - b.positionInRoutine)
              .map((workout, workoutIndex) => (
                <React.Fragment
                  key={
                    workout.workoutId ||
                    `${workout.workoutId + "-" + workout.uniqueKey}`
                  }
                >
                  <tr>
                    <td className="p-3 pl-0 flex gap-2">
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
                        } p-1 font-bold text-xl border rounded-full `}
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
                        } p-1 font-bold text-xl border rounded-full`}
                      >
                        &nbsp;↓&nbsp;
                      </button>
                      <label className="font-bold text-lg">Workout Name</label>
                    </td>
                    <td className="p-3">
                      <Input
                        placeholder="Workout Name"
                        type="text"
                        styles={inputStyles}
                        onChange={(newName) =>
                          handleWorkoutNameChange(workoutIndex, newName)
                        }
                        value={workout.workoutName}
                      />
                    </td>
                    <td></td>
                    <td></td>
                    <td className="p-3">
                      <Image
                        className="hover:cursor-pointer"
                        src={trashIcon}
                        width={25}
                        height={25}
                        alt="delete"
                        onClick={() => removeWorkout(workout)}
                      ></Image>
                    </td>
                  </tr>
                  {workout.workoutExercises
                    .sort((a, b) => a.positionInWorkout - b.positionInWorkout)
                    .map((exercise, exerciseIndex) => (
                      <React.Fragment
                        key={
                          exercise.workoutExerciseId ||
                          `${workout.uniqueKey + "-" + exercise.uniqueKey}`
                        }
                      >
                        {/* <tr className="border border-transparent border-t-slate-300"> */}
                        <tr>
                          <td className="p-3 pl-5 pr-0 flex gap-2">
                            <button
                              onClick={() =>
                                swapExercises(
                                  workoutIndex,
                                  exerciseIndex,
                                  exerciseIndex - 1,
                                  exercise.positionInWorkout,
                                  exercise.positionInWorkout - 1
                                )
                              }
                              disabled={exerciseIndex === 0}
                              className={`${
                                exerciseIndex === 0
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              } p-1 font-bold text-xl border rounded-full `}
                            >
                              &nbsp;↑&nbsp;
                            </button>
                            <button
                              onClick={() =>
                                swapExercises(
                                  workoutIndex,
                                  exerciseIndex,
                                  exerciseIndex + 1,
                                  exercise.positionInWorkout,
                                  exercise.positionInWorkout + 1
                                )
                              }
                              disabled={
                                exerciseIndex ===
                                workout.workoutExercises.length - 1
                              }
                              className={`${
                                exerciseIndex ===
                                workout.workoutExercises.length - 1
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              } p-1 font-bold text-xl border rounded-full`}
                            >
                              &nbsp;↓&nbsp;
                            </button>
                            <label className="font-bold text-lg">
                              Exercise
                            </label>
                          </td>
                          <td className="p-3">
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
                          </td>
                          <td className="p-3 pl-5 pr-0">
                            <label className="font-bold text-lg">Sets</label>
                          </td>
                          <td className="p-3">
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
                          </td>
                          <td className="p-3">
                            <Image
                              className="hover:cursor-pointer"
                              src={trashIcon}
                              width={20}
                              height={20}
                              alt="delete"
                              onClick={() =>
                                removeExerciseFromWorkout(
                                  workoutIndex,
                                  exerciseIndex,
                                  exercise
                                )
                              }
                            ></Image>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}

                  <tr>
                    <td className="pl-5 pb-4" colSpan={1}>
                      <Button
                        label="Add Exercise"
                        handleClick={() => addExerciseToWorkout(workout)}
                        customStyles="p-0 pt-1 pb-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-50"
                      ></Button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}

            <tr>
              <td className="pt-3 pl-5 " colSpan={4}>
                {errorMessage.length > 0 && (
                  <>
                    <ErrorCard message={errorMessage}></ErrorCard>
                    <br></br>
                  </>
                )}

                <Button
                  label="Add Workout"
                  handleClick={() => addWorkout()}
                  customStyles="p-0 pt-1 pb-1 rounded-lg text-white"
                ></Button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="pt-5">
          <Button
            label="Save"
            handleClick={log}
            customStyles="text-white"
          ></Button>
        </div>
      </>
    );
  }
};
export default EditRoutine;
