import React, { useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Authcontext } from "../../shared/components/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./PlaceForm.css";

const NewPlace = () => {
  const auth = useContext(Authcontext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, InputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_users");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/Tripguide/image/upload",
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
      // 1️⃣ Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(
        formState.inputs.image.value
      );

      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      await sendRequest(
        import.meta.env.VITE_BACKEND_URL + "/places",
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
          authorization: `Bearer ${auth.token}`,
        }
      );

      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form border-black" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          className="border"
          element="input"
          type="text"
          label="Title"
          placeholder="Enter your title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="please enter a valid title"
          onInput={InputHandler}
        />
        <Input
          id="description"
          className="border-4 border-gray-950 px-10	"
          element="textarea"
          type="text"
          label="Description"
          placeholder="Enter your title"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="please enter a valid description (5char)"
          onInput={InputHandler}
        />
        <Input
          id="address"
          className="border-4 border-gray-950	"
          element="input"
          type="text"
          label="Address"
          placeholder="Enter your title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="please enter a valid address"
          onInput={InputHandler}
        />
        <ImageUpload
          id="image"
          onInput={InputHandler}
          errorText="Please provide an image"
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
