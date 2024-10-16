// "use client";
import React from "react";
import checkmark from "../../assets/confirmation_checkmark.png";
import ButtonComponent from "./Button";
import { navigateRoutines } from "@/app/utils/navigationActions";

interface SuccessModalProps {
  showModal: boolean;
  successText: string;
  navigateFunction: () => {};
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  showModal,
  successText,
  navigateFunction,
}) => {
  return (
    <>
      {showModal && (
        <div className="bg-black bg-opacity-20 flex justify-center items-center fixed w-full h-full inset-0 z-50">
          <div className="w-11/12 sm:w-2/3 md:w-2/4 bg-white rounded-xl flex flex-col items-center p-8">
            <img src={checkmark.src} width={150}></img>
            <h1 className="font-bold text-4xl pb-5 text-center">
              {successText}
            </h1>
            <ButtonComponent
              label="Return to Routines"
              customStyles="text-white bg-orange-500 hover:bg-orange-400"
              handleClick={navigateFunction}
            ></ButtonComponent>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessModal;
