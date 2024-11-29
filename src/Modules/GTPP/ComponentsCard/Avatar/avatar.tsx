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
  const { userLog } = useContextDeufault();
  const [userElements, setUserElements] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(true);

  // Função que retorna uma Promise resolvida com os dados
  const loadUserData = async () => {
    if (!user) return;

    const userPromises = user.user.map(async (item: { task_id: number; user_id: number; status: boolean }) => {
      // @ts-ignore
      const fetchedUser = await new User({ id: item.user_id }); // Supondo que `User` seja uma função assíncrona
      return (
        <div key={item.user_id}>
          <Image src={convertImage(fetchedUser.photo) ?? ImageUser} alt={fetchedUser.name} title={fetchedUser.name} />
          <div>{item.user_id}</div>
        </div>
      );
    });

    const resolvedElements = await Promise.all(userPromises);
    setUserElements(resolvedElements);
    setLoading(false); // Atualiza o estado para indicar que o carregamento terminou
  };

  // Se a função de carregamento ainda não foi chamada, chamamos ela aqui.
  if (loading) {
    loadUserData(); // Chama a função para carregar os dados
    return <div>Carregando usuários...</div>; // Retorna o estado de carregamento
  }

  return (
    <div className="modal-list d-flex align-items-center gap-3">
      <div>
        {userElements} {/* Renderiza os elementos do usuário após carregados */}
      </div>
    </div>
  );
};

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
