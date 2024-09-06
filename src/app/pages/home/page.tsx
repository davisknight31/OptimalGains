import React from "react";
import Button from "@/app/components/button/Button";
import PageContainer from "@/app/components/page-container/PageContainer";
import Card from "@/app/components/card/Card";
import Welcome from "@/app/components/welcome/Welcome";
import ActivePeriod from "@/app/components/active-period/ActivePeriod";
import "./page.css";

const HomePage: React.FC = () => {
  const onClick = async () => {
    "use server";
    console.log("we logged");
  };

  return (
    <main>
      <PageContainer>
        <div className="home-cards">
          <Card>
            <Welcome name="John"></Welcome>
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
        </div>
      </PageContainer>
    </main>
  );
};

export default HomePage;
