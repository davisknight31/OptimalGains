import { PeriodSet } from "./periodSet";

export interface PeriodExercise {
  periodExerciseId: number;
  periodWorkoutId: number;
  workoutExerciseId: number;
  periodSets: PeriodSet[];
}
