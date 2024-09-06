import Button from "@/app/components/button/Button";
import React from "react";

const LoginPage: React.FC = () => {
  const onClick = async () => {
    "use server";
    console.log("we logged");
  };

  return (
    <>
      <Button handleClick={onClick} label="Label"></Button>
    </>
  );
};

export default LoginPage;
