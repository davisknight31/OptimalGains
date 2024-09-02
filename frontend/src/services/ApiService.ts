import axios from "axios";
import { ExerciseRoutine } from "../types/ExerciseRoutine";

export class ApiService {
  private BASE_URL = "http://localhost:1000";

  api = axios.create({
    baseURL: this.BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  generateRoutine = async (
    experienceLevel: string,
    splitType: string,
    daysInTheGym: string,
    overallGoal: string,
    equipmentAvailability: string
  ): Promise<ExerciseRoutine> => {
    const response = await this.api.get<ExerciseRoutine>(
      "/optimal-gains/generate-routine",
      {
        params: {
          experienceLevel: experienceLevel,
          splitType: splitType,
          daysInTheGym: daysInTheGym,
          overallGoal: overallGoal,
          equipmentAvailability: equipmentAvailability,
        },
      }
    );
    return response.data;
  };
}
