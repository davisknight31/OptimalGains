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

  generateRoutine = async (): Promise<ExerciseRoutine> => {
    const response = await this.api.get<ExerciseRoutine>(
      "/optimal-gains/generate-routine"
    );
    return response.data;
  };
}
