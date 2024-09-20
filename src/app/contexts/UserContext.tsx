"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { User } from "../types/user";
import { Routine } from "../types/routine";

interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  user: User | undefined;
  setUser: (user: User) => void;
  // routineBeingEdited: Routine | undefined;
  // setRoutineBeingEdited: (routine: Routine) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();
  // const [routineBeingEdited, setRoutineBeingEdited] = useState<Routine>();

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        // routineBeingEdited,
        // setRoutineBeingEdited,
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
