"use client";
import React, { useEffect, useState } from "react";
import { Period } from "@/app/types/period";
import ButtonComponent from "../shared-components/Button";
import trashIcon from "../../assets/trashIcon_Black.png";
import {
  navigateNewPeriod,
  navigateViewPeriods,
} from "@/app/utils/navigationActions";
import SuccessModal from "../shared-components/SuccessModal";
import Modal from "../shared-components/Modal";

interface PeriodListProps {
  periods: Period[];
}

const PeriodList: React.FC<PeriodListProps> = ({ periods }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {});

  function handleViewNavigation(periodId: number) {
    navigateViewPeriods(periodId);
  }

  function showConfirmationModal() {
    if (periods.find((period) => period.active === true)) {
      setShowModal(!showModal);
    } else {
      navigateNewPeriod();
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-orange-500">Periods</h1>

      <table className="w-full">
        {periods.length > 0 ? (
          <tbody className="[&>*:nth-child(even)]:bg-slate-50">
            {periods
              .sort(
                (a, b) =>
                  new Date(b.dateStarted).getTime() -
                  new Date(a.dateStarted).getTime()
              )
              .map((period) => (
                <tr key={period.periodId}>
                  <td className="font-bold text-xl p-3 pt-5 pb-5 w-fit">
                    {period.periodName}
                  </td>
                  <td className="p-3 pt-5 pb-5">
                    {period.active ? (
                      <span className="bg-green-300 rounded-lg p-3 text-green-700 font-bold">
                        Active
                      </span>
                    ) : period.completed ? (
                      <span className="bg-blue-300 rounded-lg p-3 text-blue-700 font-bold">
                        Completed
                      </span>
                    ) : (
                      <span className="bg-red-300 rounded-lg p-3 text-red-700 font-bold text-nowrap">
                        Not Completed
                      </span>
                    )}
                  </td>
                  <td className="p-3 pt-5 pb-5 w-2/4 text-right">
                    <ButtonComponent
                      label="View"
                      handleClick={() => handleViewNavigation(period.periodId)}
                      customStyles="p-0 pt-1 pb-1 rounded-md text-white bg-orange-500 hover:bg-orange-400"
                    ></ButtonComponent>
                  </td>
                  {/* <td>
                  <img
                    className="hover:cursor-pointer min-w-6"
                    src={trashIcon.src}
                    width={24}
                    height={24}
                    alt="delete"
                    onClick={() => {
                      setRoutineToDelete(routine);
                      setShowDeleteModal(true);
                    }}
                  ></img>
                </td> */}
                </tr>
              ))}
            <tr>
              <td colSpan={3}>
                <ButtonComponent
                  label="Start a new period"
                  handleClick={showConfirmationModal}
                  customStyles="p-3 text-white bg-orange-500 hover:bg-orange-400"
                ></ButtonComponent>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody className="pt-5 font-bold text-xl">
            <tr>
              <td className="font-bold text-xl p-3 pt-5 pb-5 w-fit">
                You have no periods.
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <ButtonComponent
                  label="Start a new period"
                  handleClick={showConfirmationModal}
                  customStyles="p-3 text-white bg-orange-500 hover:bg-orange-400"
                ></ButtonComponent>
              </td>
            </tr>
          </tbody>
        )}
      </table>

      {/* <div className="pt-5">
   
      </div> */}
      <Modal showModal={showModal}>
        <p className="font-bold text-2xl text-center pb-5">
          Starting a new period will set your current period to inactive. This
          cannot be undone.
        </p>
        <div className="w-full flex gap-5">
          <ButtonComponent
            label="Deny"
            handleClick={() => setShowModal(!showModal)}
            customStyles="text-white p-3 bg-red-500 hover:bg-red-400"
          ></ButtonComponent>
          <ButtonComponent
            label="Confirm"
            handleClick={() => {
              navigateNewPeriod();
            }}
            customStyles="text-white p-3 bg-green-500 hover:bg-green-400"
          ></ButtonComponent>
        </div>
      </Modal>
    </>
  );
};
//   <Modal showModal={showDeleteModal}>
//     <p className="font-bold text-2xl text-center pb-5">
//       Confirm the deletion of{" "}
//       <span className="text-orange-400">
//         {routineToDelete?.routineName}
//       </span>
//       ?
//     </p>
//     <div className="w-full flex gap-5">
//       <Button
//         label="Deny"
//         handleClick={() => setShowDeleteModal(false)}
//         customStyles="text-white p-3 bg-red-500 hover:bg-red-400"
//       ></Button>
//       <Button
//         label="Confirm"
//         handleClick={() => removeRoutine(routineToDelete)}
//         customStyles="text-white p-3 bg-green-500 hover:bg-green-400"
//       ></Button>
//     </div>
//   </Modal>

export default PeriodList;
