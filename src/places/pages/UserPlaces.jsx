import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Authcontext } from "../../shared/components/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [userPlaces, setUserPlaces] = useState([]);
  const auth = useContext(Authcontext);
  const userId = useParams().userId;
  const getUserPlace = async () => {
    try {
      const response = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/places/user/${userId}`
      );
      setUserPlaces(response.places);
      console.log(response.places);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserPlace();
  }, [sendRequest]);

  const placeDeletedHandler = deletedPlaceId => [
    setUserPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    ),
  ];

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <PlaceList item={userPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
