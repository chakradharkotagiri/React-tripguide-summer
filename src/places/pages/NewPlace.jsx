import React, { useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Authcontext } from "../../shared/components/context/auth-context";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import "./PlaceForm.css";

const NewPlace = () => {
  const auth = useContext(Authcontext);
  const history = useHistory();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
      address: { value: "", isValid: false },
      image: { value: null, isValid: false },
    },
    false
  );

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

    const data = await res.json();
    return data.secure_url;
  };

  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const imageUrl = await uploadImageToCloudinary(
        formState.inputs.image.value
      );

      await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/places`,
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          image: imageUrl,
          creator: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        }
      );

      history.push("/");
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      <Card className="place-card">
        {isLoading && <LoadingSpinner asOverlay />}

        <h2 className="place-title">Add a New Place</h2>
        <p className="place-subtitle">
          Share a beautiful place you’ve discovered
        </p>

        <form className="place-form" onSubmit={placeSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            placeholder="Enter place title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
          />

          <Input
            id="description"
            element="textarea"
            label="Description"
            placeholder="Describe the place"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Description should be at least 5 characters."
            onInput={inputHandler}
          />

          <Input
            id="address"
            element="input"
            type="text"
            label="Address"
            placeholder="Enter address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid address."
            onInput={inputHandler}
          />

          <ImageUpload
            id="image"
            center
            onInput={inputHandler}
            errorText="Please provide an image."
          />

          <Button type="submit" disabled={!formState.isValid}>
            ADD PLACE
          </Button>
        </form>
      </Card>
    </>
  );
};

export default NewPlace;
