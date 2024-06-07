import React from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import PlaceList from "../components/PlaceList";
import Image1 from "../../assets/images/download (1).jpeg"
const DUMMY_PLACES = [
  {
    id: "p1",
    title : "Empire State Building",
    description: "One of the most iconic landmarks in the world!",
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9856654,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most iconic landmarks in the world!",
    imageUrl:"/../src/assets/images/download (1).jpeg",
     address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9856654,
    },
    creator: "u2",
  },
];

const UserPlaces = () => {
   const userId= useParams().userId;
   const loadedPlaces=DUMMY_PLACES.filter(place => place.creator === userId )
  return (
    <div>
      <PlaceList item={loadedPlaces} />
    </div>
  );
};

export default UserPlaces;
