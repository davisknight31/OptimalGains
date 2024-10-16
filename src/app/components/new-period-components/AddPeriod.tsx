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
      <div className="mb-4 mt-3 flex">
        <label className="font-bold text-lg block">Period Name:&nbsp;</label>
        <Input
          placeholder="Name"
          type="text"
          styles={
            inputStyles + " disabled:bg-slate-100 disabled:cursor-not-allowed"
          }
          onChange={(newValue: string) => {
            setNewPeriodName(newValue);
          }}
          value={newPeriodName}
          //   disabled={selectedRoutine ? false : true}
        />
      </div>
      <div className="mb-4 flex">
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

      <div className="mb-4 flex">
        <label className="font-bold text-lg block">
          Length in Weeks:&nbsp;
        </label>
        <Input
          placeholder="Length"
          type="number"
          styles={
            inputStyles + " disabled:bg-slate-100 disabled:cursor-not-allowed"
          }
          onChange={handlePeriodLengthChange}
          value={newPeriodLength?.toString()}
          disabled={selectedRoutine ? false : true}
        />
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
