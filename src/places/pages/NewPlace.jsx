import React from "react";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../shared/util/60 - validators";
import "./NewPlace.css";

const NewPlace = () => {
  return (
    <form className="place-form border-black">
      <Input
        className="border"
        element="input"
        type="text"
        label="Title"
        validators={[  VALIDATOR_REQUIRE()]}
        errorText="please enter a valid title"
      />
    </form>
  );
};

export default NewPlace;
