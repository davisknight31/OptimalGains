"use client";
import RoutlineList from "@/app/components/shared-components/RoutineList";
import Card from "@/app/components/shared-components/Card";
import Navbar from "@/app/components/shared-components/Navbar";
import PageContainer from "@/app/components/shared-components/PageContainer";
import { useUser } from "@/app/contexts/UserContext";
import { navigateLogin, navigatePeriods } from "@/app/utils/navigationActions";
import { useEffect, useState } from "react";
import { getRoutines } from "@/app/services/apiService";
import PeriodList from "@/app/components/periods-components/PeriodList";
import { useSearchParams } from "next/navigation";
import { Period } from "@/app/types/period";
import PeriodOverview from "@/app/components/view-period-components/PeriodOverview";
const PeriodsPage: React.FC = () => {
  const { isLoggedIn, user, setUser } = useUser();
  const [periodToEdit, setPeriodToEdit] = useState<Period | undefined>();

  const searchParams = useSearchParams();
  const periodId = searchParams.get("periodId");

  useEffect(() => {
    if (!isLoggedIn) {
      navigateLogin();
    }
  });

  useEffect(() => {
    console.log("periodID: ", periodId);
    if (periodId) {
      const parsedPeriodID = parseInt(periodId);

      //if in user periods a period is found that matches the url's periodId, good
      //otherwise set to undefined, as the periodId does not belong to the current user.
      const retrievedPeriod = user?.periods
        ? user?.periods.find((period) => period.periodId === parsedPeriodID)
        : undefined;
      if (retrievedPeriod === undefined) {
        navigatePeriods();
      } else {
        setPeriodToEdit(retrievedPeriod);
      }
    }
  }, [periodId]);

  return (
    <>
      <main>
        <Navbar></Navbar>
        <PageContainer>
          <div className="flex flex-col gap-7">
            <Card>
              <PeriodOverview period={periodToEdit}></PeriodOverview>
            </Card>
          </div>
        </PageContainer>
      </main>
    </>
  );
};
export default PeriodsPage;
