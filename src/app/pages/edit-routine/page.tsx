"use client";
import EditRoutine from "@/app/components/edit-routine-components/EditRoutine";
import Card from "@/app/components/shared-components/Card";
import Navbar from "@/app/components/shared-components/Navbar";
import PageContainer from "@/app/components/shared-components/PageContainer";
import { useUser } from "@/app/contexts/UserContext";
import { navigateLogin } from "@/app/utils/navigationActions";
import { useEffect } from "react";

const EditRoutinePage: React.FC = () => {
  const { isLoggedIn, user } = useUser();

  useEffect(() => {
    if (!isLoggedIn) {
      navigateLogin();
    }
  });

  useEffect(() => {
    //find the routine by the params routineId
    //first check if an id was even passed, if none was passed you know to create new
    //if an id was passed, edit that routine
    //first find the routine by the id
    //if found, edit as normal
    //if not, redirect back to the routines page since that means the user probably passed the id themselves in the url
  });

  return (
    <>
      <Navbar></Navbar>
      <PageContainer>
        <Card>
          <EditRoutine></EditRoutine>
        </Card>
      </PageContainer>
    </>
  );
};
export default EditRoutinePage;
