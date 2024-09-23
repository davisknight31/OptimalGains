export interface RoutineResponses {
  routines: RoutineResponse[];
}

interface RoutineResponse {
  routineId: number;
  routineName: string;
  lengthInDays: number;
}
