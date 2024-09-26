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

interface EditRoutineProps {
  routine?: Routine;
}

interface ExerciseOption {
  label: string;
  value: Exercise;
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

const EditRoutine: React.FC<EditRoutineProps> = ({ routine }) => {
  const { exercises } = useUser();
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [routineName, setRoutineName] = useState<string>("");
  const [lengthInDays, setLengthInDays] = useState<string>("");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [inputSets, setInputSets] = useState<{ [key: string]: string }>({});
  const [exerciseOptions, setExerciseOptions] = useState<ExerciseOption[]>([]);
  const [addedWorkoutExercises, setAddedWorkoutExercises] = useState<{
    [key: number]: NewWorkoutExercise[];
  }>({});
  const [newWorkouts, setNewWorkouts] = useState<NewWorkout[]>([]);
  const [workoutsToDelete, setWorkoutsToDelete] = useState<number[]>([]);
  const [workoutExercisesToDelete, setWorkoutExercisesToDelete] = useState<
    number[]
  >([]);
  const [newWorkoutIdCounter, setNewWorkoutIdCounter] = useState<number>(0);
  const [newExerciseIdCounter, setNewExerciseIdCounter] = useState<number>(0);

  const inputStyles: string =
    "p-1 rounded-lg bg-transparent border-2 border-slate-100 placeholder-slate-400 focus:outline-0";

  useEffect(() => {
    setFilteredExercises(exercises);
    const mappedOptions: ExerciseOption[] = exercises.map((exercise) => ({
      label: exercise.exerciseName,
      value: exercise,
    }));
    setExerciseOptions(mappedOptions);
  }, []);

  useEffect(() => {
    if (routine) {
      setRoutineName(routine.routineName);
      setLengthInDays(routine.lengthInDays.toString());
      setWorkouts(routine.workouts || []);
    }
  }, [routine]);
  useEffect(() => {
    console.log("New workouts updated:", newWorkouts);
  }, [newWorkouts]);

  const handleRoutineNameChange = (value: string) => {
    setRoutineName(value);
  };

  const handleLengthInDaysChange = (value: string) => {
    setLengthInDays(value);
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

  function swapNewExercises(
    workoutIndex: number,
    exerciseIndexOne: number,
    exerciseIndexTwo: number
  ): void {
    const updatedNewWorkouts = [...newWorkouts];
    const copiedNewWorkoutExercises = [
      ...updatedNewWorkouts[workoutIndex].newWorkoutExercises,
    ];

    [
      copiedNewWorkoutExercises[exerciseIndexOne],
      copiedNewWorkoutExercises[exerciseIndexTwo],
    ] = [
      copiedNewWorkoutExercises[exerciseIndexTwo],
      copiedNewWorkoutExercises[exerciseIndexOne],
    ];

    updatedNewWorkouts[workoutIndex] = {
      ...updatedNewWorkouts[workoutIndex],
      newWorkoutExercises: [...copiedNewWorkoutExercises],
    };

    setNewWorkouts([...updatedNewWorkouts]);
  }

  function swapWorkouts(
    workoutIndexOne: number,
    workoutIndexTwo: number
  ): void {
    const updatedWorkouts = [...workouts];

    [updatedWorkouts[workoutIndexOne], updatedWorkouts[workoutIndexTwo]] = [
      updatedWorkouts[workoutIndexTwo],
      updatedWorkouts[workoutIndexOne],
    ];
    setWorkouts([...updatedWorkouts]);
  }

  function swapNewWorkouts(
    workoutIndexOne: number,
    workoutIndexTwo: number
  ): void {
    const updatedNewWorkouts = [...newWorkouts];

    [updatedNewWorkouts[workoutIndexOne], updatedNewWorkouts[workoutIndexTwo]] =
      [
        updatedNewWorkouts[workoutIndexTwo],
        updatedNewWorkouts[workoutIndexOne],
      ];

    setNewWorkouts([...updatedNewWorkouts]);
  }

  function addExerciseToWorkout(workoutIndex: number): void {
    setAddedWorkoutExercises((prevExercises) => ({
      ...prevExercises,
      [workoutIndex]: [
        ...(prevExercises[workoutIndex] || []),
        {
          sets: 0,
          workoutId: workoutIndex,
          exerciseId: 0,
        },
      ],
    }));
  }

  function addWorkout(): void {
    setNewWorkouts([
      ...newWorkouts,
      {
        uniqueId: newWorkoutIdCounter,
        newWorkoutName: "",
        newWorkoutExercises: [],
      },
    ]);

    setNewWorkoutIdCounter(newWorkoutIdCounter + 1);
  }

  function addExerciseToNewWorkout(newWorkoutIndex: number): void {
    setNewWorkouts((prevNewWorkouts) =>
      prevNewWorkouts.map((workout, i) => {
        if (i === newWorkoutIndex) {
          return {
            ...workout,
            newWorkoutExercises: [
              ...(workout.newWorkoutExercises || []),
              { uniqueId: newExerciseIdCounter, exerciseId: 0, sets: 0 },
            ],
          };
        }
        return workout;
      })
    );
    setNewExerciseIdCounter(newExerciseIdCounter + 1);
  }

  function removeExistingExerciseFromWorkout(
    workoutIndex: number,
    workoutExerciseIndex: number,
    workoutExerciseId: number //This is the actual id to remove from the datbase
  ): void {
    setWorkoutExercisesToDelete([
      ...workoutExercisesToDelete,
      workoutExerciseId,
    ]);

    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout, i) =>
        i === workoutIndex
          ? {
              ...workout,
              workoutExercises: workout.workoutExercises.filter(
                (exercise, j) => j !== workoutExerciseIndex
              ),
            }
          : workout
      )
    );
  }

  function removeExistingWorkout(workoutId: number): void {
    setWorkoutsToDelete([...workoutsToDelete, workoutId]);
    setWorkouts((prevWorkouts) =>
      prevWorkouts.filter((workout) => workout.workoutId !== workoutId)
    );
    const deletedWorkoutsExercisesIds = workouts
      .find((workout) => workout.workoutId === workoutId)
      ?.workoutExercises.map((exercise) => exercise.workoutExerciseId);
    setWorkoutExercisesToDelete([
      ...workoutExercisesToDelete,
      ...(deletedWorkoutsExercisesIds || []),
    ]);
  }

  const log = () => {
    console.log("Pulled Workouts: ", workouts);
    console.log("Added Exercises: ", addedWorkoutExercises);
    console.log("New Workouts: ", newWorkouts);
    console.log(
      "Existing Workout Exercises to Delete: ",
      workoutExercisesToDelete
    );

    console.log("Existing Workouts to Delete", workoutsToDelete);
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
            {workouts.map((workout, workoutIndex) => (
              <React.Fragment key={workout.workoutId || workoutIndex}>
                <tr>
                  <td className="p-3 pl-0 flex gap-2">
                    <button
                      onClick={() =>
                        swapWorkouts(workoutIndex, workoutIndex - 1)
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
                        swapWorkouts(workoutIndex, workoutIndex + 1)
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
                      onClick={() => removeExistingWorkout(workout.workoutId)}
                    ></Image>
                  </td>
                </tr>
                {workout.workoutExercises.map((exercise, exerciseIndex) => (
                  <React.Fragment key={exercise.exerciseId || exerciseIndex}>
                    {/* <tr className="border border-transparent border-t-slate-300"> */}
                    <tr>
                      <td className="p-3 pl-5 pr-0">
                        <label className="font-bold text-lg">Exercise</label>
                      </td>
                      <td className="p-3">
                        <Select
                          options={exerciseOptions}
                          value={exerciseOptions.find(
                            (option) =>
                              option.value.exerciseId === exercise.exerciseId
                          )}
                          styles={customBasicStyles}
                          onChange={(newExercise: ExerciseOption) =>
                            handleExerciseChange(
                              exerciseIndex,
                              workoutIndex,
                              newExercise.value
                            )
                          }
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
                            removeExistingExerciseFromWorkout(
                              workoutIndex,
                              exerciseIndex,
                              exercise.workoutExerciseId
                            )
                          }
                        ></Image>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                {addedWorkoutExercises[workout.workoutId]?.map(
                  (newExercise, newExerciseIndex: number) => (
                    <React.Fragment key={newExerciseIndex}>
                      <tr>
                        <td className="p-3 pl-5 pr-0">
                          <label className="font-bold text-lg">Exercise</label>
                        </td>
                        <td className="p-3">
                          <Select
                            options={exerciseOptions}
                            styles={customBasicStyles}
                            onChange={(selectedExercise: ExerciseOption) => {
                              setAddedWorkoutExercises((prevExercises) => ({
                                ...prevExercises,
                                [workout.workoutId]: prevExercises[
                                  workout.workoutId
                                ].map((exercise, index) =>
                                  index === newExerciseIndex
                                    ? {
                                        ...exercise,
                                        exerciseId:
                                          selectedExercise.value.exerciseId,
                                      }
                                    : exercise
                                ),
                              }));
                            }}
                          ></Select>
                        </td>
                        <td className="p-3 pl-5 pr-1">
                          <label className="font-bold text-lg">Sets</label>
                        </td>
                        <td className="p-3">
                          <Input
                            placeholder="Sets"
                            type="number"
                            styles={inputStyles + " w-16"}
                            onChange={(newSets) =>
                              setAddedWorkoutExercises((prevExercises) => ({
                                ...prevExercises,
                                [workout.workoutId]: prevExercises[
                                  workout.workoutId
                                ].map((exercise, index) =>
                                  index === newExerciseIndex
                                    ? { ...exercise, sets: parseInt(newSets) }
                                    : exercise
                                ),
                              }))
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
                              setAddedWorkoutExercises((prevExercises) => ({
                                ...prevExercises,
                                [workout.workoutId]: prevExercises[
                                  workout.workoutId
                                ].filter(
                                  (exercise, j) => j !== newExerciseIndex
                                ),
                              }))
                            }
                          ></Image>
                        </td>
                      </tr>
                    </React.Fragment>
                  )
                )}
                <tr>
                  <td className="pl-5 pb-4" colSpan={1}>
                    <Button
                      label="Add Exercise"
                      handleClick={() =>
                        addExerciseToWorkout(workout.workoutId)
                      }
                      customStyles="p-0 pt-1 pb-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-50"
                    ></Button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
            {newWorkouts.map((newWorkout, newWorkoutIndex) => (
              <React.Fragment key={newWorkout.uniqueId}>
                <tr>
                  <td className="p-3 pl-0 flex gap-2">
                    <button
                      onClick={() =>
                        swapNewWorkouts(newWorkoutIndex, newWorkoutIndex - 1)
                      }
                      disabled={newWorkoutIndex === 0}
                      className={`${
                        newWorkoutIndex === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      } p-1 font-bold text-xl border rounded-full `}
                    >
                      &nbsp;↑&nbsp;
                    </button>
                    <button
                      onClick={() =>
                        swapNewWorkouts(newWorkoutIndex, newWorkoutIndex + 1)
                      }
                      disabled={newWorkoutIndex === newWorkouts.length - 1}
                      className={`${
                        newWorkoutIndex === newWorkouts.length - 1
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
                      onChange={(newName) => {
                        setNewWorkouts((prevNewWorkouts) =>
                          prevNewWorkouts.map((workout, i) =>
                            i === newWorkoutIndex
                              ? { ...workout, newWorkoutName: newName }
                              : workout
                          )
                        );
                      }}
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
                      onClick={() => {
                        setNewWorkouts((prevNewWorkouts) =>
                          prevNewWorkouts.filter(
                            (exercise, i) => i !== newWorkoutIndex
                          )
                        );
                      }}
                    ></Image>
                  </td>
                </tr>
                {newWorkout.newWorkoutExercises.map(
                  (newWorkoutExercise, newWorkoutExerciseIndex) => (
                    <React.Fragment key={newWorkoutExercise.uniqueId}>
                      <tr>
                        <td className="p-3 pl-5 pr-0 flex gap-2">
                          <button
                            onClick={() =>
                              swapNewExercises(
                                newWorkoutIndex,
                                newWorkoutExerciseIndex,
                                newWorkoutExerciseIndex - 1
                              )
                            }
                            disabled={newWorkoutExerciseIndex === 0} // Disable if it's the first exercise
                            className={`${
                              newWorkoutExerciseIndex === 0
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            } p-1 font-bold text-xl border rounded-full`}
                          >
                            &nbsp;↑&nbsp;
                          </button>
                          <button
                            onClick={() =>
                              swapNewExercises(
                                newWorkoutIndex,
                                newWorkoutExerciseIndex,
                                newWorkoutExerciseIndex + 1
                              )
                            }
                            disabled={
                              newWorkoutExerciseIndex ===
                              newWorkout.newWorkoutExercises.length - 1
                            } // Disable if it's the last exercise
                            className={`${
                              newWorkoutExerciseIndex ===
                              newWorkout.newWorkoutExercises.length - 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            } p-1 font-bold text-xl border rounded-full`}
                          >
                            &nbsp;↓&nbsp;
                          </button>
                          <label className="font-bold text-lg pl-2">
                            Exercise
                          </label>
                        </td>
                        <td className="p-3">
                          <Select
                            options={exerciseOptions}
                            styles={customBasicStyles}
                            onChange={(selectedExercise: ExerciseOption) => {
                              setNewWorkouts((prevNewWorkouts) =>
                                prevNewWorkouts.map((workout, i) =>
                                  i === newWorkoutIndex
                                    ? {
                                        ...workout,
                                        newWorkoutExercises:
                                          workout.newWorkoutExercises.map(
                                            (exercise, j) =>
                                              j === newWorkoutExerciseIndex
                                                ? {
                                                    ...exercise,
                                                    exerciseId:
                                                      selectedExercise.value
                                                        .exerciseId,
                                                  }
                                                : exercise
                                          ),
                                      }
                                    : workout
                                )
                              );
                            }}
                          ></Select>
                        </td>
                        <td className="p-3 pl-5 pr-1">
                          <label className="font-bold text-lg">Sets</label>
                        </td>
                        <td className="p-3">
                          <Input
                            placeholder="Sets"
                            type="number"
                            styles={inputStyles + " w-16"}
                            onChange={(newSets) => {
                              setNewWorkouts((prevNewWorkouts) =>
                                prevNewWorkouts.map((workout, i) =>
                                  i === newWorkoutIndex
                                    ? {
                                        ...workout,
                                        newWorkoutExercises:
                                          workout.newWorkoutExercises.map(
                                            (exercise, j) =>
                                              j === newWorkoutExerciseIndex
                                                ? {
                                                    ...exercise,
                                                    sets: parseInt(newSets),
                                                  }
                                                : exercise
                                          ),
                                      }
                                    : workout
                                )
                              );
                            }}
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
                              setNewWorkouts((prevNewWorkouts) =>
                                prevNewWorkouts.map((workout, i) =>
                                  i === newWorkoutIndex
                                    ? {
                                        ...workout,
                                        newWorkoutExercises:
                                          workout.newWorkoutExercises.filter(
                                            (exercise, j) =>
                                              j !== newWorkoutExerciseIndex
                                          ),
                                      }
                                    : workout
                                )
                              )
                            }
                          ></Image>
                        </td>
                      </tr>
                    </React.Fragment>
                  )
                )}

                <tr>
                  <td className="pl-5 pb-4" colSpan={1}>
                    <Button
                      label="Add Exercise"
                      handleClick={() =>
                        addExerciseToNewWorkout(newWorkoutIndex)
                      }
                      customStyles="p-0 pt-1 pb-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-50"
                    ></Button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
            <tr>
              <td className="pt-3 pl-5 " colSpan={4}>
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
