"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { User } from "../types/user";
import { Routine } from "../types/routine";
import { Exercise } from "../types/exercise";

interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  user: User | undefined;
  setUser: (user: User) => void;
  exercises: Exercise[]; //Will be set to all the basic exercises from Exercises table and whatever exercises the specific user has added
  setExercises: (exercoses: Exercise[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();
  const [exercises, setExercises] = useState<Exercise[]>([]); //Will be set to all the basic exercises from Exercises table and whatever exercises the specific user has added

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        exercises,
        setExercises,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
