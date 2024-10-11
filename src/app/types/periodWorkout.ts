import { PeriodExercise } from "./periodExercise";

export interface PeriodWorkout {
  periodWorkoutId: number;
  periodId: number;
  workoutId: number;
  periodWorkoutName: string;
  date: Date;
  completed: boolean;
  periodExercises: PeriodExercise[];
}
