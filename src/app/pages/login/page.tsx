"use client";
import Button from "@/app/components/button/Button";
import React, { useState } from "react";
import { testLog } from "@/app/utils/helpers";
import Card from "@/app/components/card/Card";
import PageContainer from "@/app/components/page-container/PageContainer";
import Input from "@/app/components/input/Input";
import { useUser } from "@/app/contexts/UserContext";
import { redirect } from "next/navigation";
import { navigateHome } from "@/app/utils/navigationActions";
import { registerUser } from "@/app/services/apiService";

enum LoginPageText {
  NoAccountQuestion = "Don't have an account?",
  HasAccountQuestion = "Already have an account?",
  CreateAccount = "Create Account",
  LogIn = "Log In",
}

const LoginPage: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [askIfUserHasAccountText, setAskIfUserHasAccountText] = useState(
    LoginPageText.NoAccountQuestion
  );
  const [showCreateAccountButtonText, setShowCreateAccountButtonText] =
    useState(LoginPageText.CreateAccount);

  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
  };

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleShowCreateAccountChange = () => {
    setErrorMessage("");
    setShowCreateAccount(!showCreateAccount);
    setShowCreateAccountButtonText(
      showCreateAccount ? LoginPageText.CreateAccount : LoginPageText.LogIn
    );
    setAskIfUserHasAccountText(
      showCreateAccount
        ? LoginPageText.NoAccountQuestion
        : LoginPageText.HasAccountQuestion
    );
  };

  function verifyCreateAccountFieldsAreFilled(): boolean {
    if (
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setErrorMessage("All fields must be filled");
      return false;
    }
    return true;
  }

  function login(): void {
    setIsLoggedIn(true);
    navigateHome();
  }

  function checkPasswordsMatch(): boolean {
    if (password == confirmPassword) {
      return true;
    } else {
      setErrorMessage("Passwords must match.");
      return false;
    }
  }

  async function createAccount(): Promise<void> {
    if (verifyCreateAccountFieldsAreFilled() && checkPasswordsMatch()) {
      // const response = await fetch("/api/auth/register", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     username: username,
      //     password: password,
      //     firstName: firstName,
      //     lastName: lastName,
      //     email: email,
      //   }),
      // });
      // const data = await response.json();
      const response = await registerUser(
        username,
        password,
        firstName,
        lastName,
        email
      );
      console.log(response);
    } else {
      console.log("Couldn't create account");
    }
  }

  return (
    <>
      <PageContainer>
        <div className="w-3/6 min-w-80 m-auto">
          <Card>
            {!showCreateAccount && (
              <>
                <h1 className="text-4xl font-bold text-orange-500 mb-2 text-center">
                  Log In
                </h1>
                <Input
                  placeholder="Username"
                  type="text"
                  onChange={handleUsernameChange}
                ></Input>
                <br></br>
                <Input
                  placeholder="Password"
                  type="password"
                  onChange={handlePasswordChange}
                ></Input>
                <Button handleClick={login} label="Log In"></Button>
              </>
            )}

            {showCreateAccount && (
              <>
                <h1 className="text-4xl font-bold text-orange-500 mb-2 text-center">
                  Create Account
                </h1>
                <Input
                  placeholder="Username"
                  type="text"
                  onChange={handleUsernameChange}
                ></Input>
                <br></br>
                <Input
                  placeholder="Password"
                  type="password"
                  onChange={handlePasswordChange}
                ></Input>
                <br></br>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  onChange={handleConfirmPasswordChange}
                ></Input>
                <div className="flex gap-5">
                  <Input
                    placeholder="First Name"
                    type="text"
                    onChange={handleFirstNameChange}
                  ></Input>
                  <Input
                    placeholder="Last Name"
                    type="text"
                    onChange={handleLastNameChange}
                  ></Input>
                </div>
                <Input
                  placeholder="Email"
                  type="text"
                  onChange={handleEmailChange}
                ></Input>
                <Button
                  handleClick={createAccount}
                  label="Create Account"
                ></Button>
              </>
            )}
            <div className="text-wrap text-red-600 font-semibold text-center mt-5">
              {errorMessage}
            </div>
            <div className="w-fit m-auto mt-4">
              <div>{askIfUserHasAccountText}</div>
              <button
                className="text-orange-500 font-semibold w-full"
                onClick={handleShowCreateAccountChange}
              >
                {showCreateAccountButtonText}
              </button>
            </div>
          </Card>
        </div>
      </PageContainer>
    </>
  );
};

export default LoginPage;
