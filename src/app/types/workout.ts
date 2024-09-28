import { WorkoutExercise } from "./workoutExercise";

export interface Workout {
  workoutId?: number;
  uniqueKey?: number;
  workoutName: string;
  positionInRoutine: number;
  workoutExercises: WorkoutExercise[];
}
