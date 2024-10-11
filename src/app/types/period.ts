import { PeriodWorkout } from "./periodWorkout";

export interface Period {
  periodId: number;
  userId: number;
  routineId: number;
  periodName: string;
  dateStarted: Date;
  dateStopped: Date;
  lengthInWeeks: number;
  active: boolean;
  completed: boolean;
  periodWorkouts: PeriodWorkout[];
}
// userPeriods: {
//   periodId: number;
//   userId: number;
//   routineId: number;
//   periodName: string;
//   dateStarted: Date;
//   lengthInWeeks: number;
//   active: boolean;
//   completed: boolean;
// }[]
