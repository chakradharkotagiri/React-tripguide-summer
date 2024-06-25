import React, { useEffect, useState, useContext } from "react";
import {
  useParams,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { Authcontext } from "../../shared/components/context/auth-context";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UpdatePlace = () => {
  const auth = useContext(Authcontext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeid = useParams().placeId;
  const history = useHistory();

  const [formState, InputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const fetchPlace = async () => {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/places/${placeid}`
      );
      setLoadedPlace(responseData.place);
      setFormData(
        {
          title: {
            value: responseData.place.title,
            isValid: true,
          },
          description: {
            value: responseData.place.description,
            isValid: true,
          },
        },
        true
      );
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPlace();
  }, [sendRequest, placeid, setFormData]);

  // useEffect(() => {
  //   if (identifiedPlace) {
  //     setFormData(
  //       {
  //         title: {
  //           value: identifiedPlace.title,
  //           isValid: true,
  //         },
  //         description: {
  //           value: identifiedPlace.description,
  //           isValid: true,
  //         },
  //       },
  //       true
  //     );
  // //   }

  //   setIsLoading(false);
  // }, [setFormData, identifiedPlace]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {
      console.log("patch sent");
      await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}places/${placeid}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          'authorization':`Bearer ${auth.token}`        }
      );
      history.push("/places");
    } catch (err) {
      console.log(err);
    }
    console.log(formState.inputs);
  };

  if (isLoading) {
    return (
      <div className="center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    <div>
      <Card>
        <h1>Could not find place!</h1>
      </Card>
    </div>;
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE]}
            errorText="Please enter a valid title."
            onInput={InputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description(Min charecters - '5')."
            onInput={InputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
