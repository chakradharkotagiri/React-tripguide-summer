import React from "react";
import "./UserItem.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Avatar from "../../shared/components/UIElements/Avatar";
import "../../shared/components/UIElements/Card";
import Card from "../../shared/components/UIElements/Card";

const UsersItem = (props) => {
    return (
    <li className="user-item items-center">
      <Card className="user-item__content ">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar image={props.image} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2 className=" font-extrabold underline text-blue-500 ">
              {props.name}
            </h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "place" : "places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UsersItem;
