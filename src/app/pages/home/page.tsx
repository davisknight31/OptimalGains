"use client";
import React, { useEffect } from "react";
import PageContainer from "@/app/components/page-container/PageContainer";
import Card from "@/app/components/card/Card";
import Welcome from "@/app/components/welcome/Welcome";
import ActivePeriod from "@/app/components/active-period/ActivePeriod";
import Routines from "@/app/components/routines/Routines";
import { Routine } from "@/app/types/routine";
import Navbar from "@/app/components/navbar/Navbar";
import { useUser } from "@/app/contexts/UserContext";
import { redirect } from "next/navigation";
import { navigateLogin } from "@/app/utils/navigationActions";

const HomePage: React.FC = () => {
  const { isLoggedIn, user } = useUser();

  useEffect(() => {
    if (!isLoggedIn) {
      navigateLogin();
    }
  });

  return (
    <main>
      <Navbar></Navbar>
      <PageContainer>
        <div className="flex flex-col gap-7">
          <Card>
            <Welcome name={user?.firstName}></Welcome>
          </Card>
          <Card>
            <ActivePeriod
              routineName="MyRoutine"
              currentWeek={6}
              totalWeeks={8}
              nextWorkoutName="Chest and triceps"
            ></ActivePeriod>
            {/* <Button handleClick={onClick} label="Start Next Workout"></Button> */}
          </Card>
          {/* <Card>
            <Routines routines={testRoutines}></Routines>
          </Card> */}
        </div>
      </PageContainer>
    </main>
  );
};

export default HomePage;
