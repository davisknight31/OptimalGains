export interface WorkoutExercise {
  workoutExerciseId?: number;
  workoutId?: number;
  uniqueKey?: number;
  exerciseId: number;
  sets: number;
  positionInWorkout: number;
  targetReps: number;
}
