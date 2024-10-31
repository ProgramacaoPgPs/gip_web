import React from "react";
import "./AvatarGroup.css";

const Avatar = (props: { name:string, src:string, online: boolean }) => {
  return (
    <div className="avatar cursor-pointer">
      <img src={props.src || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"} alt={props.name} />
      {props.online && <span className="online-dot"></span>}
    </div>
  );
};

const AvatarGroup = (props: { users: any, dataTask: any }) => {
  const maxToShow = 2;
  const extraUsersCount = props.users.length - maxToShow;

  // console.log(props.dataTask);

  return (
    <React.Fragment>
        <div className="avatar-group">
        {props.users.slice(0, maxToShow).map((user: any, index: number) => (
            <Avatar key={index} name={user.user_id} src={user.src} online={!user.status} />
        ))}

        {extraUsersCount > 0 && (
            <div className="extra-users cursor-pointer">+{extraUsersCount}</div>
        )}
        </div>
    </React.Fragment>
  );
};

export default AvatarGroup;
