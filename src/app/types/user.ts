import { Period } from "./period";
import { Routine } from "./routine";

export interface User {
  userId: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  createdAt: Date;
  routines: Routine[] | null;
  periods: Period[] | [];
}

export interface loginUser {
  userId: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  createdAt: Date;
}
