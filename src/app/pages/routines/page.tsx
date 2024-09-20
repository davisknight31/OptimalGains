"use client";
import RoutlineList from "@/app/components/shared-components/RoutineList";
import Card from "@/app/components/shared-components/Card";
import Navbar from "@/app/components/shared-components/Navbar";
import PageContainer from "@/app/components/shared-components/PageContainer";
import { useUser } from "@/app/contexts/UserContext";
import { navigateLogin } from "@/app/utils/navigationActions";
import { useEffect } from "react";

const RoutinesPage: React.FC = () => {
  const { isLoggedIn, user } = useUser();

  useEffect(() => {
    if (!isLoggedIn) {
      navigateLogin();
    }
  });

  return (
    <>
      <main>
        <Navbar></Navbar>
        <PageContainer>
          <div className="flex flex-col gap-7">
            <Card>
              <RoutlineList routines={user?.routines || []} />
            </Card>
          </div>
        </PageContainer>
      </main>
    </>
  );
};
export default RoutinesPage;
