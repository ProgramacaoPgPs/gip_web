import React from "react";
import "./AvatarGroup.css";

const Avatar = (props: { name:string, src:string, online: boolean }) => {
  return (
    <div className="avatar cursor-pointer">
      <img src={props.src} alt={props.name} />
      {props.online && <span className="online-dot"></span>}
    </div>
  );
};

const AvatarGroup = (props: { users: any, dataTask: any }) => {
  const maxToShow = 2;
  const extraUsersCount = props.users.length - maxToShow;

  console.log(props.dataTask);

  return (
    <React.Fragment>
        <div className="avatar-group">
        {props.users.slice(0, maxToShow).map((user: any, index: number) => (
            <Avatar key={index} name={user.name} src={user.src} online={user.online} />
        ))}

        {extraUsersCount > 0 && (
            <div className="extra-users cursor-pointer">+{extraUsersCount}</div>
        )}
        </div>
    </React.Fragment>
  );
};

export default AvatarGroup;
