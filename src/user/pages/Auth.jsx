import React, { useState, useContext } from "react";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { Authcontext } from "../../shared/components/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import "./Auth.css";

const Auth = () => {
  const auth = useContext(Authcontext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  /* ============================
     CLOUDINARY UPLOAD (PROFILE)
  ============================ */
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "frontend_unsigned");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmdrtetyn/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();
    return data.secure_url;
  };

  /* ============================
     SWITCH LOGIN / SIGNUP
  ============================ */
  const switchModeHandler = () => {
    if (!isLoginMode) {
      // Switch to LOGIN
      setFormData(
        {
          email: formState.inputs.email,
          password: formState.inputs.password,
        },
        formState.inputs.email.isValid &&
          formState.inputs.password.isValid
      );
    } else {
      // Switch to SIGNUP
      setFormData(
        {
          ...formState.inputs,
          name: { value: "", isValid: false },
          image: { value: null, isValid: false },
        },
        false
      );
    }
    setIsLoginMode((prev) => !prev);
  };

  /* ============================
     SUBMIT HANDLER
  ============================ */
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    // LOGIN
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }

    // SIGNUP
    else {
      try {
        // 1️⃣ Upload profile image to Cloudinary
        const imageUrl = await uploadImageToCloudinary(
          formState.inputs.image.value
        );

        // 2️⃣ Send JSON to backend
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/users/signup`,
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            image: imageUrl, // ✅ Cloudinary URL
          }),
          { "Content-Type": "application/json" }
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}

        <h2 className="auth-title">
          {isLoginMode ? "Welcome Back" : "Create an Account"}
        </h2>

        <p className="auth-subtitle">
          {isLoginMode ? "Login to continue" : "Sign up to get started"}
        </p>

        <hr />

        <form className="auth-form" onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              placeholder="Enter your name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid name."
              onInput={inputHandler}
            />
          )}

          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="Please provide a profile image."
            />
          )}

          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            placeholder="Enter your email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={inputHandler}
          />

          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Password must be at least 6 characters."
            onInput={inputHandler}
          />

          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGN UP"}
          </Button>
        </form>

        <div className="auth-switch">
          <span>
            {isLoginMode
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <Button inverse onClick={switchModeHandler}>
            {isLoginMode ? "SIGN UP" : "LOGIN"}
          </Button>
        </div>
      </Card>
    </>
  );
};

export default Auth;
