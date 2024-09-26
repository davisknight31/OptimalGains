import { NewWorkoutExercise } from "./newWorkoutExercise";

export interface NewWorkout {
  uniqueId?: number;
  newWorkoutName: string;
  newWorkoutExercises: NewWorkoutExercise[];
}
