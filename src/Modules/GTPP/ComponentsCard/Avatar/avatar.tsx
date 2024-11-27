// AvatarGroup.tsx
import React, { useEffect, useState } from "react";
import "./AvatarGroup.css";
import { Connection } from "../../../../Connection/Connection";
import { convertImage } from "../../../../Util/Util";
import Aside from './aside';
import userImage from "../../../../Assets/Image/user.png";

const Avatar = (props: { name: string, src: string, online: boolean, allPhotosUsers?: any, isShownNameUser?: any }) => {
  const [user, setUser] = useState<any>('');
  const [photo, setPhoto] = useState<any>('');

  useEffect(() => {
    async function getPhoto(photoUserId: any) {
      const connection = new Connection("18", true);
      let result = await connection.get("&id=" + photoUserId, "CCPP/Employee.php");
      let photo = await connection.get("&id=" + photoUserId, "CCPP/EmployeePhoto.php");
      setPhoto(photo);
      setUser(result);
    }
    props.allPhotosUsers.map((item: any) => {
      if(photo.user_id === item.user_id) {
        getPhoto(item.user_id);
      }
    });
  }, [props.allPhotosUsers, photo]);

  return (
    <div className="d-flex gap-3 align-items-center">
      <div className="avatar cursor-pointer">
        <img 
          src={convertImage(photo.photo) || userImage} 
          alt={props.name} 
        />
        {props.online && <span className="online-dot"></span>}
      </div>

      {/* Exibindo os nomes dos colaboradores com uma chave única */}
      {props.isShownNameUser && user?.data?.map((element: any, index:any) => (
        <div key={element.user_id}>
          {element?.name}
        </div>
      ))}
    </div>
  );
};


const AvatarGroup = (props: { users: any, dataTask: any }) => {
  const maxToShow = 2;
  const extraUsersCount = props.users.length - maxToShow;
  const [isOpenAside, setIsOpenAside] = useState<any>(false);

  useEffect(() => {
    console.log(props.users);
  }, [props.users]);

  return (
    <div className="avatar-group-container">
      {isOpenAside ? (
        <Aside
          funcAss={() => setIsOpenAside(false)}
          title="Colaboradores"
          content={<div className="d-flex flex-column justify-content-around">
            {props.users.map((user: any, index: number) => (
              <Avatar key={index} name={user.user_id} src={user.src} online={!user.status} allPhotosUsers={props.users} isShownNameUser={isOpenAside} />
            ))}
          </div>}
        />
      ) : (
        <div className="avatar-group" onClick={() => setIsOpenAside(true)}>
        {props.users.slice(0, maxToShow).map((user: any, index: number) => (
          <Avatar key={index} name={user.user_id} src={user.src} online={!user.status} allPhotosUsers={props.users} />
        ))}
        {extraUsersCount > 0 && (
          <div className="extra-users cursor-pointer">+{extraUsersCount}</div>
        )}
      </div>
      )}
    </div>
  );
};

export default AvatarGroup;
