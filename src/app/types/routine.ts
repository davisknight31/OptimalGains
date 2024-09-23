import { Workout } from "./workout";

export interface Routine {
  routineId: number;
  routineName: string;
  lengthInDays: number;
  workouts: Workout[];
  //moredata
  //moredata
  //   days: Day[];
}

// interface Day {
//   dayName: string;
//   exercises: Exercise[];
// }

// interface Exercise {
//   exerciseName: string;
//   muscleGroup: string;
// }
