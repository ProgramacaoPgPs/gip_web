import React, { useEffect } from "react";
import { InputCheckbox } from "../../../../Components/CustomForm";
import { SubTasksWithCheckboxProps } from "./Types";
import { Connection } from "../../../../Connection/Connection";
import { useMyContext } from "../../../../Context/MainContext";
import { useWebSocket } from "../../Context/GtppWsContext";
// import useConnect from "../../hook/webSocketConnect";


const SubTasksWithCheckbox: React.FC<SubTasksWithCheckboxProps> = ({
  subTasks,
  //   onTaskChange,
  //   setRenderList,
  //   getPercent,
}) => {
  // Modified by Hygor -> Análisar para exclusão - depreciado devido nova tratativa de dados.
  // const connection = new Connection("18", true);
  // // const { webSocketInstance } = useMyContext();


  // // Função para manipular mensagens recebidas
  // const handleNewMessage = (message: any) => {
  //   console.log("Nova mensagem recebida:", message);
  // };

  // // Função para monitorar o estado da conexão
  // const getStateWebSocket = () => {
  //   console.log("Estado do WebSocket foi alterado!");
  // };


  // const {isConnected, messages, socket} = useConnect({
  //   getStateWebSocket, 
  //   handleNewMessage,
  // });

  // const handleCheckboxChange = async (id: number, checked: boolean, idTask: any, task: any) => {
  //   onTaskChange(id, checked);



  //   let result = await connection.put({ check: checked, id: id, task_id: idTask }, "GTPP/TaskItem.php");
  //   setRenderList((prev: any) => !prev);

  //   // Exemplo de envio de mensagem quando conectado
  //   const sendMessage = () => {
  //     if (socket && isConnected) {
  //       const message = {
  //         data: {
  //           user_id: localStorage?.userGTPP,
  //           object: {
  //             description: task.check
  //               ? "Um item foi marcado"
  //               : "Um item foi desmarcado",
  //             /*  @ts-ignore */
  //             percent: result.data?.percent,
  //             itemUp: task,
  //           },
  //           task_id: idTask,
  //           type: 2,
  //         },
  //       };
  //       socket.send(JSON.stringify(message));
  //       console.log("Mensagem enviada:", message);
  //     } else {
  //       console.log("WebSocket não está conectado.");
  //     }
  //   };


  // sendMessage();
  /* @ts-ignore */
  // getPercent(result.data?.percent);

  // };

  const { checkedItem } = useWebSocket();

  return (
    <div className="overflow-auto mt-3" style={{ height: "176px" }}>
      {subTasks.map((task, index: number) => (
        <div key={task.id} className="d-flex gap-2 align-items-center mb-2">
          <InputCheckbox
            label={task.description}
            onChange={(e: any) => {
              // Modified by Hygor
              checkedItem(
                task.id,
                e.target.checked,
                task.task_id,
                task
              );
            }

            }
            value={task.check}
            key={index}
          />
        </div>
      ))}
    </div>
  );
};

export default SubTasksWithCheckbox;
