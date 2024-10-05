"use client";
import RoutlineList from "@/app/components/shared-components/RoutineList";
import Card from "@/app/components/shared-components/Card";
import Navbar from "@/app/components/shared-components/Navbar";
import PageContainer from "@/app/components/shared-components/PageContainer";
import { useUser } from "@/app/contexts/UserContext";
import { navigateLogin } from "@/app/utils/navigationActions";
import { useEffect } from "react";
import { getRoutines } from "@/app/services/apiService";

const RoutinesPage: React.FC = () => {
  const { isLoggedIn, user, setUser } = useUser();

  useEffect(() => {
    if (!isLoggedIn) {
      navigateLogin();
    }
  });
  async function refreshRoutines() {
    if (user) {
      await getRoutines(user.userId).then((fetchedRoutines) => {
        setUser({ ...user, routines: fetchedRoutines });
      });
    }
  }
  return (
    <>
      <main>
        <Navbar></Navbar>
        <PageContainer>
          <div className="flex flex-col gap-7">
            <Card>
              <RoutlineList
                routines={user?.routines || []}
                refreshRoutines={refreshRoutines}
              />
            </Card>
          </div>
        </PageContainer>
      </main>
    </>
  );
};
export default RoutinesPage;
