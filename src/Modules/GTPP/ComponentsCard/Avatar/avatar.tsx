import React, { useEffect, useState } from "react";
import "./AvatarGroup.css";
import ImageUser from "../../../../Assets/Image/user.png";
import { useMyContext as useContextDeufault} from "../../../../Context/MainContext";
import { convertImage } from "../../../../Util/Util";
import { Connection } from "../../../../Connection/Connection";
import { InputCheckbox } from "../../../../Components/CustomForm";

const Image = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return <img {...props} />;
};

// Aqui nesse user estou puxando as informações da conexão de employee e colocando suas informações em uma lista e enviando essa lista para um objeto e mostrando ela em tela com a foto do usuario  e suas informações.
const UserProfile = (props: any) => {
  const {userId} = props;
  const [photos, setPhotos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const conn = new Connection('18');
        const userList: any = [];
        
        // Verifica se userId é um array e mapeia sobre ele
        if (Array.isArray(userId)) {
          for (let user of userId) {
            const responsePhotos:any = await conn.get(`&id=${user.user_id}`, 'CCPP/EmployeePhoto.php');
            const responseDetails:any = await conn.get(`&id=${user.user_id}`, 'CCPP/Employee.php');

            // Aqui estou rendenrizando antes um JSON com as informações do usuario + suas photos em um mesmo JSON para não ter necessidade de tratar isso separadamente.
            if((responseDetails && !responseDetails.error) && (responsePhotos && !responsePhotos.error)) {
              const details = responseDetails.data[0];
              userList.push({
                name: details.name,
                company: details.company,
                shop: details.shop,
                department: details.departament,
                sub: details.sub,
                CSDS: details.CSDS,
                administrator: responseDetails.data[1]?.administrator,
                photo: responsePhotos.photo
              });
            }
          }
          setPhotos(userList);
        } else {
          setPhotos([]);
        }
      } catch (error: any) {
        setError(error.message);
        console.log(error);
      }
    };

    loadPhotos();
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  // Aqui precisos desenvolver uma lógica de como podemos ver se usuário está online ou não

  return (
    <div className="">
      {/* Aqui vamos fazer o botão para fechar a lista de usuários */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <strong>Colaboradores</strong>
        </div>
        <button className="btn btn-danger text-white" onClick={() => props.detailsmodaluser(true)}>X</button>
      </div>      

      {/* Aqui vamos carregar a lista de usuarios */}
      {photos.length > 0 ? (
        photos.map((photo, index) => (
          //@ts-ignore
          <div className="d-flex gap-4 align-items-center mb-2">
            <div key={photo.taskId} onClick={() => {
              // Aqui quero fazer um modal aonde que eu clicar quero pegar os dados do usuário e exibir esses dados para mostrar as informações dele.
              props.setOpenDetailUser(true);
              props.listuser(photo);
            }} className={`avatar`}> {/* ${photos?.sessionUser ? 'avatar-green' : 'avatar-red'} --> Aqui vamos veririficar se o usuário está online ou não */}
              <Image
                title={photo.name} // Aqui vamos exibir o nome do usuario
                src={convertImage(photo.photo) || ImageUser} 
                alt={`User ${index}`} 
              />
            </div>
            <div>
              <p><strong>{photo.name}</strong></p>
            </div>
          </div>
        ))
      ) : (
        <p>Carregando colaboradores...</p>
      )}
    </div>
  );
};

const LoadUserCheck = (props: any) => {
  /* Aqui vamos carregar a lista de usuários que pode chegar a participar da tarefa */
  const [userTaskBind, setUserTaskBind] = useState<any[]>([]);
  

  useEffect(() => {
    const loadUserTaskLis = async () =>{
        const connection = new Connection('18');
        try {
          const userList: any = [];
          // precisamos pesquisar quem é o list user e o que ele faz para que conseguirmos pegar todos os usuários e fazer a vinculação dele com a tarefa!
          const responseUserTaskList: any = await connection.get(`&task_id=${props.list.data.datatask.id}&list_user=1`, 'GTPP/Task_User.php');
          for (let user of responseUserTaskList.data) {

            // precisamos carregar essas photos antes do que os dados para não ter um atraso no carregamento.
            const responsePhotos:any = await connection.get(`&id=${user.user_id}`, 'CCPP/EmployeePhoto.php');

            userList.push({
              photo: responsePhotos.photo, // responsePhotos.photo --> é aqui que faz com que a busca dos dados demore porque é aonde que os dados estão sendo carregados paras ser utilizados.
              check: user.check,
              name: user.name,
              user: user.user_id
            });
          }

          // console.log(userList);
          setUserTaskBind(userList); 

        } 
      catch (error: any) {
        console.log(error.message);
      }
    }
    loadUserTaskLis();
  }, []);

  return (
    <div>
      <div className="">
        {/* Aqui estamos trabalhando para conseguir renderizar */}
        {userTaskBind.length > 0 ? (
          <>
          {userTaskBind.map((item: any) => (
            <ListUserTask item={item} taskid={props.list.data.datatask.id} key={item.user_id} />
          ))}
          </>
        ) : (
          <p>
            Carregando todos os colaboradores...
          </p>
        )}
      </div>
    </div>
  )
}


const ListUserTask = ({ item, taskid }:any) => {
  const [isChecked, setIsChecked] = useState(item.check);
  const connection = new Connection('18');

  return (
    <div
      className={`d-flex gap-4 rounded w-100 align-items-center p-1 mb-2 ${isChecked ? 'bg-secondary' : 'bg-normal'}`}
      onClick={async () => {
        // Aqui só precisa fazer o PUT para conseguir fazer vincular um usuário na lista.
        setIsChecked(!isChecked);
        let result = await connection.put({ check: !isChecked, name: item.name, user_id: item.user, task_id: taskid }, 'GTPP/Task_User.php');
        console.log(result);

      }}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => {
          setIsChecked(e.target.checked);
          console.log('Checkbox toggled:', e.target.checked);
        }}
        hidden
      />
      <div className="avatar">
        <Image src={convertImage(item.photo) || ImageUser} />
      </div>
      <div>
        <strong>{item.name}</strong>
      </div>
    </div>
  );
};

// Aqui é aonde vou fazer o modal dos usuarios, a pessoa vai clicar em um dos usuarios e vai abrir ele aqui, e vai enxergar algumas informações importantes sobre esse usuário.
function ModalUser (props: any){
  const [loadUserTask, setLoadUserTask] = useState(true);

  return (
    <React.Fragment>
      <div className="border-dark bg-dark text-white rounded portrait d-flex flex-column justify-content-between">
          {loadUserTask ? (
            <React.Fragment>
              {props.openDetailUser ? (
                <>
                  <div className="d-flex align-items-center justify-content-end mb-2">
                    <button className="btn bg-danger text-white" onClick={() => props.setOpenDetailUser(false)}>X</button>
                  </div>
                  <div className="text-center">
                    <Image className="rounded img-fluid img-thumbnail w-100" src={convertImage(props.list?.photo) || ImageUser}  />
                  </div>
                  <p><strong>Nome:</strong> {props.list?.name}</p>          
                  <p><strong>departamento:</strong> {props.list?.department}</p>
                  <p><strong>loja:</strong> {props.list?.shop}</p>
                  <p><strong>subdepartamento:</strong> {props.list?.sub}</p>
                </>
              ) : (
                <>{props.children}</>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div><strong>Adicione Colaboradores</strong></div>
                <div><button className="btn bg-danger text-white" onClick={() => setLoadUserTask(true)}>X</button></div>
              </div>
              <LoadUserCheck list={props} />
            </React.Fragment>
          )}
          <div className="d-flex justify-content-end">
            {/* Aqui vou fazer um modal para adicionar outros usuarios que vão poder participar das tarefas. */}
            {loadUserTask && <i className="btn fa fa-plus text-white" onClick={() => setLoadUserTask(false)}></i>}
          </div>
      </div>
    </React.Fragment>
  )
};

const Avatar = () => {
  const {userLog} = useContextDeufault();

  return (
    <div className={`avatar ${userLog.session ? `avatar-green` : `avatar-red`}`}>
      <Image title={userLog.name} alt={userLog.name} src={convertImage(userLog.photo) ?? ImageUser }/>
    </div>
  );
};

const Modal = (props:any) => {
  const [getInfoUser, setInfoUser] = useState();
  const [openDetailUser, setOpenDetailUser] = useState();

  return (
    <div className="modal-list d-flex align-items-center gap-3">
      <div>
        <ModalUser data={props} list={getInfoUser} openDetailUser={openDetailUser} setOpenDetailUser={setOpenDetailUser} children={<UserProfile detailsmodaluser={props.detailsmodaluser} listuser={setInfoUser} setOpenDetailUser={setOpenDetailUser} userId={props.user} />}/>
      </div>
    </div>
  );
};

const AvatarGroup = (props: { users: any, dataTask: any }) => {
  // Aqui estamos abrindo ou fechando um modal aonde podemos visualizar todos os usuarios que estão conectado a uma tarefa.
  const [openDetailsUser, setOpenDetailsUserModal] = useState(true);

  return (
    <React.Fragment>
      <div className="cursor-pointer">
      {openDetailsUser ? (
        <div onClick={() => setOpenDetailsUserModal(prev => !prev)}>
          <Avatar />
        </div>
      ) : (
        <React.Fragment>
          {/* Apos clicar em um usuário da lista eu vou capturar os dados dele e vou exibir um modelo */}
          <Modal detailsmodaluser={setOpenDetailsUserModal} datatask={props?.dataTask}  user={props?.users} />
        </React.Fragment>
      )}
    </div>
    </React.Fragment>
  );
};

export default AvatarGroup;
