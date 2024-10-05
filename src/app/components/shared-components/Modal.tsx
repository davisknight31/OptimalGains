// "use client";
import React from "react";
import checkmark from "../../assets/confirmation_checkmark.png";
import ButtonComponent from "./Button";
import { navigateRoutines } from "@/app/utils/navigationActions";

interface ModalProps {
  showModal: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ showModal, children }) => {
  return (
    <>
      {showModal && (
        <div className="bg-black bg-opacity-20 flex justify-center items-center fixed w-full h-full inset-0 z-50">
          <div className="w-11/12 sm:w-2/3 md:w-2/4 bg-white rounded-xl flex flex-col items-center p-8">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
