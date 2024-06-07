import React from "react";
import UsersItem from "./UsersItem";
import '../../shared/components/UIElements/Card'
import './UsersList.css'

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
        <h2>No users found.</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul>
      {props.items.map((user) => (
        <UsersItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  );
};

export default UsersList;
