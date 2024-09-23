import { WorkoutExercise } from "./workoutExercise";

export interface Workout {
  workoutId: number;
  workoutName: string;
  positionInRoutine: number;
  workoutExercises: WorkoutExercise[];
}
