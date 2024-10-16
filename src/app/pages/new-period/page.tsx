"use client";
import AddPeriod from "@/app/components/new-period-components/AddPeriod";
import Card from "@/app/components/shared-components/Card";
import Navbar from "@/app/components/shared-components/Navbar";
import PageContainer from "@/app/components/shared-components/PageContainer";
import { useUser } from "@/app/contexts/UserContext";
import { getPeriods } from "@/app/services/apiService";
import { navigateLogin } from "@/app/utils/navigationActions";
import React, { useEffect } from "react";

const NewPeriodPage: React.FC = () => {
  const { isLoggedIn, user, setUser } = useUser();

  useEffect(() => {
    if (!isLoggedIn) {
      navigateLogin();
    }
  });

  async function refreshPeriods(): Promise<void> {
    if (user) {
      await getPeriods(user.userId).then((fetchedPeriods) => {
        setUser({ ...user, periods: fetchedPeriods });
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
              <AddPeriod
                routines={user?.routines || []}
                user={user!}
                refreshPeriods={refreshPeriods}
              ></AddPeriod>
            </Card>
          </div>
        </PageContainer>
      </main>
    </>
  );
};

export default NewPeriodPage;
