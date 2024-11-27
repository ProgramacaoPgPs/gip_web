// AvatarGroup.tsx
import React, { useEffect, useState } from "react";
import "./AvatarGroup.css";
import ImageUser from "../../../../Assets/Image/user.png";
import { useMyContext as useContextDeufault} from "../../../../Context/MainContext";
import { convertImage } from "../../../../Util/Util";
import User from "../../../../Class/User";

const Image = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return <img {...props} />;
};

const Avatar = () => {
  const {userLog} = useContextDeufault();

  return (
    <div className={`avatar ${userLog.session ? `avatar-green` : `avatar-red`}`}>
      <Image title={userLog.name} alt={userLog.name} src={convertImage(userLog.photo) ?? ImageUser }/>
    </div>
  );
};

const Modal = (user: any) => {
  const {userLog} = useContextDeufault();

  return (
    <div className="modal-list d-flex align-items-center gap-3">
      <div className=""> 
        {/* {`avatar ${userLog.session ? `avatar-green` : `avatar-red`}`}*/}
        {user ? user.user.map((item: {task_id: number, user_id: number, status: boolean}) => 
        {
          // @ts-ignore
          let user = new User({id: item.user_id});

          console.log(user);

          return (
            <div key={item.user_id}>
              <Image src={convertImage(user.photo) ?? ImageUser} alt={user.name} title={user.name} />
              <div>{item.user_id}</div>
            </div>)
        }) : null}
      </div>
    </div>
  );
}

const AvatarGroup = (props: { users: any, dataTask: any }) => {
  const [changeModal, setChangeModal] = useState(false);

  return (
    <div className="cursor-pointer" onClick={() => setChangeModal(prev => !prev)} >
      {changeModal ? (
        <div>
          <Avatar />
        </div>
      ) : (
        <Modal user={props?.users} />
      )}
    </div>
  );
};

export default AvatarGroup;
