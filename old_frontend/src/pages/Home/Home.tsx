import React, { useState } from "react";
import "./Home.scss";
import WelcomeHeader from "../../components/welcome-header-component/WelcomeHeaderComponent";
import ButtonComponent from "../../components/button-component/ButtonComponent";
import { ApiService } from "../../services/ApiService";
import RoutineListComponent from "../../components/routine-list-component/RoutineListComponent";
import { ExerciseRoutine } from "../../types/ExerciseRoutine";
import PreferencesComponent from "../../components/preferences-component/PreferencesComponent";

const Home: React.FC = () => {
  const [generatedRoutine, setGeneratedRoutine] = useState<ExerciseRoutine>();

  const setRoutineFromPreferences = (routine: ExerciseRoutine): void => {
    setGeneratedRoutine(routine);
    console.log(routine);
  };

  return (
    <div className="home-wrapper">
      <div>
        <WelcomeHeader></WelcomeHeader>
        <PreferencesComponent
          setRoutineForHome={setRoutineFromPreferences}
        ></PreferencesComponent>
        <RoutineListComponent
          exerciseRoutine={generatedRoutine}
        ></RoutineListComponent>
      </div>
    </div>
  );
};

export default Home;
