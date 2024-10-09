export interface Period {
  periodId: number;
  userId: number;
  routineId: number;
  periodName: string;
  dateStarted: Date;
  lengthInWeeks: number;
  active: boolean;
  completed: boolean;
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
