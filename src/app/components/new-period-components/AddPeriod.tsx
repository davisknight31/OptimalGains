import { customBasicStyles, inputStyles } from "@/app/docs/PreferencesData";
import { Routine } from "@/app/types/routine";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Input from "../shared-components/Input";
import ButtonComponent from "../shared-components/Button";
import { startNewPeriod } from "@/app/services/apiService";
import { User } from "@/app/types/user";
import CoverSpinner from "../shared-components/CoverSpinner";
import SuccessModal from "../shared-components/SuccessModal";
import { navigatePeriods } from "@/app/utils/navigationActions";

interface AddPeriodProps {
  routines: Routine[];
  user: User;
  refreshPeriods: () => Promise<void>;
}

interface RoutineOption {
  label: string;
  value: Routine;
}

const AddPeriod: React.FC<AddPeriodProps> = ({
  routines,
  user,
  refreshPeriods,
}) => {
  const [newPeriodName, setNewPeriodName] = useState<string>("");
  const [selectedRoutine, setSelectedRoutine] = useState<Routine>();
  const [routineOptions, setRoutineOptions] = useState<RoutineOption[]>([]);
  const [newPeriodLength, setNewPeriodLength] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (routines) {
      const createdRoutineOptions: RoutineOption[] = routines.map((routine) => {
        const option: RoutineOption = {
          label: routine.routineName,
          value: routine,
        };
        return option;
      });
      setRoutineOptions(createdRoutineOptions);
    }
  }, []);

  function handlePeriodLengthChange(value: string) {
    const numberValue = parseInt(value);
    const flooredValue = Math.floor(numberValue);
    flooredValue > 9 || flooredValue < 1
      ? setNewPeriodLength(newPeriodLength)
      : setNewPeriodLength(flooredValue.toString());
  }

  const handleCreatePeriodClick = async () => {
    setIsSubmitting(true);
    if (user) {
      await startNewPeriod(
        user.userId,
        newPeriodName,
        selectedRoutine!,
        newPeriodLength!
      );
    }
    await refreshPeriods();

    setShowConfirmationModal(true);
  };

  return (
    <>
      {isSubmitting && <CoverSpinner />}
      <h1 className="text-3xl font-bold text-orange-500">New Period</h1>
      <div className="mb-4 mt-3 flex flex-col">
        <label className="font-bold text-lg block">Period Name:&nbsp;</label>
        <Input
          placeholder="Name"
          type="text"
          styles={
            inputStyles +
            " disabled:bg-slate-100 disabled:cursor-not-allowed w-1/4"
          }
          onChange={(newValue: string) => {
            setNewPeriodName(newValue);
          }}
          value={newPeriodName}
          //   disabled={selectedRoutine ? false : true}
        />
      </div>
      <div className="mb-4 flex flex-col">
        <label className="font-bold text-lg block">Choose Routine:&nbsp;</label>
        <Select
          options={routineOptions}
          onChange={(newValue) => {
            if (newValue) {
              setSelectedRoutine(newValue.value);
            }
          }}
          styles={customBasicStyles}
        ></Select>
      </div>

      <div className="mb-4 flex flex-col">
        <label className="font-bold text-lg block">Length:&nbsp;</label>
        <Input
          placeholder="Length"
          type="number"
          styles={
            inputStyles +
            " disabled:bg-slate-100 disabled:cursor-not-allowed w-1/4"
          }
          onChange={handlePeriodLengthChange}
          value={newPeriodLength?.toString()}
          disabled={selectedRoutine ? false : true}
        />
      </div>
      <div className="p-2 border-2 border-blue-200 bg-blue-100 rounded-md text-blue-600 mb-4">
        <b>**NOTICE**</b> Length refers to the number of times you would like to
        repeat the chosen routine.
        <br></br>
        <b>Examples:</b>
        <br></br>
        <li>
          When the chosen routine's length = 7(days/workouts) and the period
          length = 4, the routine is repeated 4 times, in this case, 4 weeks.
        </li>
        <li>
          When the chosen routine's length = 5(days/workouts) and the period
          length = 6, the routine is repeated 6 times, in this case, 30 days.
        </li>
        <span className="font-bold italic">
          The last "iteration" of the routine is always treated as a deload.
        </span>
      </div>
      <ButtonComponent
        label="Create Period"
        handleClick={() => handleCreatePeriodClick()}
        customStyles="text-white p-3 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-200"
        isDisabled={
          newPeriodName && selectedRoutine && newPeriodLength ? false : true
        }
      ></ButtonComponent>
      <SuccessModal
        showModal={showConfirmationModal}
        successText="Period Created!"
        navigateFunction={navigatePeriods}
      ></SuccessModal>
    </>
  );
};

export default AddPeriod;
