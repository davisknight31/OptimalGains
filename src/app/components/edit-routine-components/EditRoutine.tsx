import React, { useEffect } from "react";
import Button from "../shared-components/Button";
import { testLog } from "@/app/utils/helpers";
import { Routine } from "@/app/types/routine";

interface EditRoutineProps {
  routine?: Routine;
}

const EditRoutine: React.FC<EditRoutineProps> = ({ routine }) => {
  return <>EditRoutine</>;
};

export default EditRoutine;
