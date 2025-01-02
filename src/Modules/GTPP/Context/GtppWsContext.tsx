import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CustomNotification, iGtppWsContextType, iStates, iTaskReq } from "../../../Interface/iGIPP";
import GtppWebSocket from "./GtppWebSocket";
import { Connection } from "../../../Connection/Connection";
import { useMyContext } from "../../../Context/MainContext";
import InformSending from "../Class/InformSending";
import { classToJSON } from "../../../Util/Util";
import NotificationGTPP from "../Class/NotificationGTPP";


const GtppWsContext = createContext<iGtppWsContextType | undefined>(undefined);

export const EppWsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [task, setTask] = useState<any>({});
  const [taskDetails, setTaskDetails] = useState<iTaskReq>({});
  const [states, setStates] = useState<iStates[]>([{ color: '', description: '', id: 0 }]);
  const [taskPercent, setTaskPercent] = useState<number>(0);
  const [messageNotification, setMessageNotification] = useState<Record<string, unknown>>({});
  const [notifications, setNotifications] = useState<CustomNotification[]>([]);

  // GET
  const [userTaskBind, setUserTaskBind] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const ws = useRef(new GtppWebSocket());
  const { userLog } = useMyContext();
  useEffect(() => {
    // Abre a coonexão com o websocket.
    ws.current.connect();
    (async () => {
      try {
        const connection = new Connection("18", true);
        const getNotify: any = await connection.get(`&id_user=${userLog.id}`, '/GTPP/Notify.php');
        if (getNotify.error) throw new Error(getNotify.message);
        updateNotification(getNotify.data);
      } catch (error) {
        console.log(error);
      }
    })();
    getStateformations();
    return () => {
      if (ws.current && ws.current.isConnected) {
        localStorage.removeItem('gtppStates');
        ws.current.disconnect();
      }
    }
  }, []);

  // Garante a atualização do callback.
  useEffect(() => {
    ws.current.callbackOnMessage = callbackOnMessage;
  }, [task, taskDetails, notifications]);

  // Recupera as informações detalhadas da tarefa.
  useEffect(() => {
    task.id && getTaskInformations();
  }, [task]);


  async function getStateformations() {
    let listState: iStates[] = [{ id: 0, description: '', color: '' }];
    try {
      if (localStorage.gtppStates) {
        listState = JSON.parse(localStorage.gtppStates);
      } else {
        const connection = new Connection("18", true);
        const getStatusTask: { error: boolean, message?: string, data?: [{ id: number, description: string, color: string }] } = await connection.get("", "GTPP/TaskState.php") || { error: false };
        if (getStatusTask.error) throw new Error(getStatusTask.message || 'Error generic');
        const list = createStorageState(getStatusTask.data || [{ id: 0, description: '', color: '' }]);
        localStorage.gtppStates = JSON.stringify(list);
        listState = list;
      }
    } catch (error) {
      console.error("Erro ao obter as informações da tarefa:", error);
    }
    setStates(listState);
  }
  function createStorageState(list: iStates[]) {
    let listState: [{ id: number, description: string, color: string }] = [{ id: 0, description: '', color: '' }];
    list.forEach((element: { id: number, description: string, color: string }, index) => {
      const item = { id: element.id, description: element.description, color: element.color, active: true }
      index == 0 ? listState[index] = item : listState.push(item);
    });
    return listState
  }
  async function getTaskInformations() {
    try {
      const connection = new Connection("18", true);
      const getTaskItem: any = await connection.get(
        `&id=${task.id}`,
        "GTPP/Task.php"
      );
      if (getTaskItem.error) throw new Error(getTaskItem.message);
      setTaskDetails(getTaskItem);
    } catch (error) {
      console.error("Erro ao obter as informações da tarefa:", error);
    }
  }

  async function callbackOnMessage(event: any) {
    let response = JSON.parse(event.data);
    setMessageNotification(response);
    if (
      response.error &&
      response.message.includes("This user has been connected to another place")
    ) {
      console.error("Derrubar usuário");
    }
    if (!response.error && response.type == 2 && response.user_id != userLog.id) {
      if (response.object) {
        updateNotification([JSON.parse(event.data)]);
        if (response.object.isItemUp) {
          itemUp(response.object);
        } else if (response.object.isStopAndToBackTask) {
          if (response.object.taskState == 2) {
          }
          if (response.object.taskState == 4) {
          }
        } else {
          console.log("Sem retorno");
        }
      }
    }

    if (!response.error && response.type == 3) {
      if (response.object) {
        getDescription(response.object);
      }
    }
  }

  function updateNotification(item: any[]) {
    const notify = new NotificationGTPP(item);
    notifications.push(...notify.list);
    setNotifications([...notifications]);
  }
  function itemUp(itemUp: any) {
    setTaskPercent(itemUp.percent);
    taskDetails.data?.task_item.forEach((element, index) => {
      if (taskDetails.data && element.id == itemUp.itemUp.id)
        taskDetails.data.task_item[index] = itemUp.itemUp;
    });
    setTaskDetails({ ...taskDetails });
  }

  function getDescription(description: any) {
    if (taskDetails.data) {
      taskDetails.data.full_description = description.full_description;
      setTaskDetails({ ...taskDetails });
    }
  }

  async function checkedItem(
    id: number,
    checked: boolean,
    idTask: any,
    taskLocal: any
  ) {
    const connection = new Connection("18");
    let result: any = await connection.put(
      { check: checked, id: id, task_id: idTask },
      "GTPP/TaskItem.php"
    );
    taskLocal.check = checked;
    setTaskPercent(result.data?.percent);
    
    // Verifica se o checked realizado alterou o status da tarefa. Se sim ele envia um alerta!
    if (result.data.state_id != task.state_id) {
      infSenStates(taskLocal,result.data);
    }
    //Informa que um item foi marcado.
    infSenCheckItem(taskLocal,result.data);
  }

  function infSenStates(taskLocal:any,result:any){
    task.state_id = result.state_id;
      setTask({...task});
      ws.current.informSending(classToJSON(new InformSending(false, userLog.id, taskLocal.task_id, 6, {
        description: "Mudou para",
        task_id: taskLocal.task_id,
        percent: result.percent, 
        state_id: result.state_id,
        task: task,
      })));
  }

  function infSenCheckItem(taskLocal:any,result:any){
    ws.current.informSending(classToJSON(new InformSending(false, userLog.id, taskLocal.task_id, 2, {
      description: taskLocal.check
        ? "Um item foi marcado"
        : "Um item foi desmarcado",
      percent: result.percent,
      itemUp: taskLocal,
      isItemUp: true,
    })));
  }

  async function checkTaskComShoDepSub(
    task_id: number,
    company_id: number,
    shop_id: number,
    depart_id: number,
    taskLocal: any
  ) {
    try {
      const connection = new Connection("18");
      await connection.post(
        {
          task_id: task_id,
          company_id: company_id,
          shop_id: shop_id,
          depart_id: depart_id,
        },
        "GTPP/TaskComShoDepSub.php"
      );
      ws.current.informSending({
        error: false,
        user_id: userLog.id,
        object: {
          description: "A descrição completa da tarefa foi atualizada",
          task_id: task_id,
          company_id: company_id,
          shop_id: shop_id,
          depart_id: depart_id,
        },
        task_id: taskLocal,
        type: 2,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddTask = async (
    description: string,
    task_id: string
  ) => {
    setLoading(true);
    try {
      const connection = new Connection('18');
      const response: any = await connection.post({
        description: description,
        file: null,
        task_id: task_id
      }, "GTPP/TaskItem.php");

      if (response.data && !response.error) {
        getTaskInformations();
        alert('Salvo com sucesso!');
      } else {
        alert('Error saved task.');
      }

    } catch (error) {
      console.error("Error adding task:", error);

    } finally {
      setLoading(false);
    }
  };

  // Aqui podemos trabalhar de forma horizontal para atualizar a descrição da tarefa de ponta a ponta.
  async function changeDescription(
    description: string,
    id: number,
    descLocal: string
  ) {
    try {
      const connection = new Connection("18");
      await connection.put(
        { id: id, full_description: description },
        "GTPP/Task.php"
      );
      ws.current.informSending({
        error: false,
        user_id: userLog.id,
        object: {
          description: "A descrição completa da tarefa foi atualizada",
          task_id: id,
          full_description: description,
        },
        task_id: descLocal,
        type: 3,
      });
    } catch (error) {
      console.log("erro ao fazer o PUT em Task.php");
    }
  }

  // AQUI VOU PRECISAR MONTAR UMA CONDICIONAL PARA MUDAR A DESCRIÇÃO E COLOCAR UMA OBSERVAÇÃO.
  async function changeObservedForm(
    taskId: number,
    subId: number,
    description: string,
    _: string,
    type: string
  ) {
    setLoading(true);
    try {
      const connection = new Connection("18"); // Instanciando a conexão com o ID
      const response: any = await connection.put(type === "description" ? {
        id: subId,
        task_id: taskId,
        description: description
      } : type === "observed" ? {
        id: subId,
        task_id: taskId,
        note: description
      } : "", "GTPP/TaskItem.php");

      if (response.message && !response.error) {
        getTaskInformations();
        alert('Salvo com sucesso!');
      } else if (response.data && !response.error) {
        getTaskInformations();
        alert('Salvo com sucesso!');
      } else {
        alert('Erro ao atualizar a tarefa!');
      }

      if (type === "description") {
        ws.current.informSending({
          error: false,
          user_id: userLog.id,
          object: {
            id: subId,
            task_id: taskId,
            description: description,
          },
          task_id: taskId,
          type: 2,
        })
      }

      if (type === "observed") {
        ws.current.informSending({
          error: false,
          user_id: userLog.id,
          object: {
            id: subId,
            task_id: taskId,
            note: description,
          },
          task_id: taskId,
          type: 2,
        })
      }

    } catch (error) {
      console.log("Erro ao tentar salvar:", error);
      alert("Ocorreu um erro ao salvar a tarefa. Tente novamente."); // Notificação amigável ao usuário
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  }

  async function upTask(taskId: number, resource: string | null, date: string | null, taskList: any, message: string) {
    await updateTask(taskId, resource, date);
    ws.current.informSending(
      classToJSON(
        new InformSending(false, userLog.id, taskId, 2, { description: message, task_id: taskId, reason: resource, days: date, taskState: taskList.state_id })
      )
    );
  }

  async function updateTask(taskId: number, resource: string | null, date: string | null) {
    const connection = new Connection("18", true);
    const req: { error: boolean, message?: string, data?: any[] } = await connection.put({ task_id: taskId, reason: resource, days: date }, "GTPP/TaskState.php") || { error: false };
    if (req.error) throw new Error();
  }
  async function stopAndToBackTask(
    taskId: number,
    resource: string | null,
    date: string | null,
    taskList: any
  ) {
    try {
      if (taskList.state_id == 5) {
        upTask(taskId, resource, date, taskList, `Tarefa que estava bloquado está de volta!`);
      } else if (taskList.state_id == 4 || taskList.state_id == 6) {
        upTask(taskId, resource, date, taskList, taskList.state_id == 4 ? `Tarefa que estava parado está de volta!` : 'Tarefa que estava completa teve que retornar!');
      } else if (taskList.state_id == 2) {
        upTask(taskId, resource, date, taskList, "A tarefa que estava ativa foi parada!");
      } else if (taskList.state_id == 3) {
        upTask(taskId, resource, date, taskList, "A tarefa finalizada!");
      }
    } catch (error) {
      console.log("erro ao fazer o PUT em TaskState.php");
    }
  }

  function clearGtppWsContext() {
    setTask({});
    setTaskDetails({});
  }

  return (
    <GtppWsContext.Provider
      value={{
        taskDetails,
        task,
        taskPercent,
        messageNotification,
        userTaskBind,
        notifications,
        states,
        setNotifications,
        setTaskPercent,
        setTask,
        handleAddTask,
        setTaskDetails,
        clearGtppWsContext,
        checkedItem,
        checkTaskComShoDepSub,
        changeDescription,
        stopAndToBackTask,
        changeObservedForm
      }}
    >
      {children}
    </GtppWsContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(GtppWsContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
