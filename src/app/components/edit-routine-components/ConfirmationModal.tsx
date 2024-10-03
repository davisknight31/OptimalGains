// "use client";
import React from "react";
import checkmark from "../../assets/confirmation_checkmark.png";
import ButtonComponent from "../shared-components/Button";
import { navigateRoutines } from "@/app/utils/navigationActions";

interface ConfirmationModalProps {
  showModal: boolean;
  confirmationText: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  showModal,
  confirmationText,
}) => {
  return (
    <>
      {showModal && (
        <div className="bg-black bg-opacity-20 flex justify-center items-center fixed w-full h-full inset-0 z-50">
          <div className="w-11/12 sm:w-2/3 md:w-2/4 bg-white rounded-xl flex flex-col items-center p-8">
            <img src={checkmark.src} width={150}></img>
            <h1 className="font-bold text-4xl pb-5 text-center">
              {confirmationText}
            </h1>
            <ButtonComponent
              label="Return to Routines"
              customStyles="text-white"
              handleClick={navigateRoutines}
            ></ButtonComponent>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationModal;
