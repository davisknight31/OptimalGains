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
  const [targetMuscleFilter, setTargetMuscleFilter] = useState<string>("");
  const [routineName, setRoutineName] = useState<string>("");
  const [lengthInDays, setLengthInDays] = useState<string>("");
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const [exerciseOptions, setExerciseOptions] = useState<ExerciseOption[]>([]);

  const inputStyles: string =
    "p-1 rounded-lg bg-transparent border-2 border-slate-100 placeholder-slate-400 focus:outline-0";

  useEffect(() => {
    setFilteredExercises(exercises);
    const exerciseOptions: ExerciseOption[] = exercises.map((exercise) => ({
      label: exercise.exerciseName,
      value: exercise,
    }));
    setExerciseOptions(exerciseOptions);
  }, []);

  useEffect(() => {
    if (routine) {
      setRoutineName(routine.routineName);
      setLengthInDays(routine.lengthInDays.toString());
      setWorkouts(routine.workouts || []);
    }
  }, [routine]);

  useEffect(() => {
    // Filter exercises based on targetMuscleFilter
    const newOptions = exercises
      .filter((exercise) => exercise.targetMuscleGroup === targetMuscleFilter)
      .map((exercise) => ({
        value: exercise,
        label: exercise.exerciseName,
      }));

    setExerciseOptions(newOptions); // Set the new options

    console.log(targetMuscleFilter);
  }, [targetMuscleFilter]);

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

  const handleExerciseSetsChange = (
    exerciseIndex: number,
    workoutIndex: number,
    newSets: number
  ) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout, i) =>
        i === workoutIndex ? { ...workout, workoutName: "s" } : workout
      )
    );
  };

  const log = () => {
    console.log(workouts);
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
            <tr>
              <td>
                <h1 className="text-2xl font-bold text-slate-300">Workouts</h1>
              </td>
            </tr>
            {workouts.map((workout, workoutIndex) => (
              <React.Fragment key={workout.workoutId || workoutIndex}>
                <tr>
                  <td className="p-3 pl-0">
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
                </tr>
                {workout.workoutExercises.map((exercise, exerciseIndex) => (
                  <>
                    <tr key={exercise.exerciseId || exerciseIndex}>
                      <td className="p-3 pl-0">
                        <label className="font-bold text-lg">Exercise</label>
                      </td>
                      <td className="p-3 ">
                        <Select
                          options={exerciseOptions}
                          styles={customBasicStyles}
                          onChange={(option) => console.log(option?.setup)}
                        ></Select>
                      </td>
                      {/* <td className="p-3">
                      <label className="text-slate-300 font-bold text-lg">
                        Filter:
                      </label>
                    </td>
                    <td className="p-3 pl-0 w-2/6">
                      <Select
                        options={targetMuscleOptions}
                        styles={customBasicStyles}
                        onChange={(targetMuscle) =>
                          setTargetMuscleFilter(targetMuscle.value)
                        }
                      ></Select>
                    </td> */}
                    </tr>
                    <tr>
                      <td className="p-3 pl-0">
                        <label className="font-bold text-lg">Sets</label>
                      </td>
                      <td className="p-3 ">
                        <Input
                          placeholder="Sets"
                          type="number"
                          styles={inputStyles}
                          onChange={(newSets) =>
                            handleWorkoutNameChange(
                              exerciseIndex,
                              workoutIndex,
                              newSets
                            )
                          }
                          value={exercise.sets.toString()}
                        />
                      </td>
                    </tr>
                  </>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <Button label="Save" handleClick={log}></Button>
      </>
    );
  }
};
export default EditRoutine;

// {
//   {workout.workoutExercises.map((workoutExercise, index) => (
//                   <tr>
//                     <td className="p-3 pl-0">
//                       <label className="font-bold text-lg">Exercise</label>
//                     </td>
//                     <td className="p-3">
//                       <Select
//                         options={}
//                         // styles={}
//                         // onChange={(option) => setSplitType(option?.value)}
//                       ></Select>
//                     </td>
//                   </tr>
//                 ))}
// }
