import React, { useEffect, useState } from "react";
import "./style.css";
import AvatarGroup from "../Avatar/avatar";
import { TaskItem } from "./Types";
import HeaderModal from "./Header";
import ProgressBar from "./Progressbar";
import FormTextAreaDefault from "./FormTextAraeaDefault";
import SubTasksWithCheckbox from "./SubtaskWithCheckbox";
import SelectTaskItem from "./SelectTaskItem";
import { Connection } from "../../../../Connection/Connection";
import { useWebSocket } from "../../Context/GtppWsContext";
import MessageModal from "../ModalMessage/messagemodal";
import ButtonIcon from "../Button/ButtonIcon/btnicon";

interface BodyDefaultProps {
  disabledForm?: boolean;
  renderList?: any;
  listSubTasks?: any;
  taskListFiltered?: any;
  taskCheckReset?: any;
  getPercent?: any;
  reset?: any;
  details?: any;
  message?: any;
}

interface ValueStateTask {
  stopTask: boolean;
  openModalQuastionTask: boolean;
  description: string;
  isCompShopDep: boolean;
  isChat: boolean;
  isObservable: boolean;
  isQuastion: boolean;
  isAttachment: boolean;
}

const BodyDefault: React.FC<BodyDefaultProps> = (props) => {
  const [valueNewTask, setValueNewTask] = useState<string>("");
  const [valueTask, setValueTask] = useState<boolean>(false);
  const { taskDetails, task, stopAndToBackTask } = useWebSocket();

  const [ListTask, setListTask] = useState<ValueStateTask>({
    stopTask: false,
    openModalQuastionTask: false,
    description: "",
    isCompShopDep: false,
    isChat: false,
    isObservable: false,
    isQuastion: false,
    isAttachment: false,
  });

  const connection = new Connection("18", true);

  const handleAddTask = async () => {
    if (valueNewTask.length > 0) {
      try {
        let response = await connection.post(
          {
            description: valueNewTask,
            file: null,
            task_id: props.taskListFiltered.id,
          },
          "GTPP/TaskItem.php"
        );
        console.log(response);
        setValueNewTask("");
        props.reset();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  return (
    <div className="row mt-3 h-100 overflow-hidden">
      <div className="d-flex justify-content-between px-4">
        <div className="d-flex align-items-center">
          <AvatarGroup
            dataTask={props.taskListFiltered}
            users={taskDetails.data ? taskDetails.data?.task_user : []}
          />
        </div>
        <div className="">
          {ListTask.openModalQuastionTask ? (
            <MessageModal
              typeInput={
                props.taskListFiltered.state_id == 2 ||
                props.taskListFiltered.state_id == 4
                  ? "text"
                  : props.taskListFiltered.state_id == 5
                  ? "number"
                  : null
              }
              title={
                props.taskListFiltered.state_id == 2
                  ? "Deseja parar mesmo a tarefa?"
                  : props.taskListFiltered.state_id == 4
                  ? "Deseja mesmo retomar a tarefa?"
                  : props.taskListFiltered.state_id == 5
                  ? "Insira o total de dias que voce precisa"
                  : null
              }
              onChange={(e: any) =>
                setListTask((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              openClock={ListTask}
              onClick={() => {
                if (ListTask.description.length > 0) {
                  stopAndToBackTask(
                    props.taskListFiltered?.id,
                    props.taskListFiltered.state_id == 4
                      ? null
                      : ListTask.description,
                    props.taskListFiltered.state_id == 5
                      ? ListTask.description
                      : null,
                    props.taskListFiltered
                  );
                  setListTask((prev) => ({
                    ...prev,
                    openModalQuastionTask: !prev.openModalQuastionTask,
                  }));
                } else {
                  alert("escreva algo");
                }
              }}
            />
          ) : null}
          <div>
            <div
              className="cursor-pointer"
              onClick={() => {
                setListTask((prev) => ({
                  ...prev,
                  openModalQuastionTask: !prev.openModalQuastionTask,
                }));
              }}
            >
              {props.taskListFiltered.state_id == 4 ? (
                <ButtonIcon
                  color="success"
                  icon="power-off"
                  description="Retomar tarefas"
                />
              ) : props.taskListFiltered.state_id == 2 ? (
                <ButtonIcon
                  color="danger"
                  icon="power-off"
                  description="Parar tarefas"
                />
              ) : props.taskListFiltered.state_id == 5 ? (
                <ButtonIcon
                  color="dark"
                  icon="clock"
                  description="Quantos dias precisa?"
                />
              ) : null}
            </div>
          </div>
          {/** */}
        </div>
      </div>
      <div className="col-md-12 row m-auto container overflow-hidden h-100">
        <div className="col-md-12 h-100">
          <FormTextAreaDefault
            task={props.taskListFiltered}
            details={props.details.data}
            disabledForm={props.disabledForm}
          />
          <div className="mt-2">
            <div className="d-flex flex-wrap gap-2">
              <ButtonIcon
                onClick={() => {
                  setListTask((prev) => ({
                    ...prev,
                    isChat: false,
                    isCompShopDep: false,
                    isAttachment: false,
                    isObservable: false,
                    isQuastion: false,
                  }));
                  setValueTask((prev) => !prev);
                }}
                color="secondary"
                icon="tasks"
                description="Tarefas"
              />
              <ButtonIcon
                onClick={() => {
                  setListTask((prev) => ({
                    ...prev,
                    isChat: !prev.isChat,
                    isCompShopDep: false,
                    isAttachment: false,
                    isObservable: false,
                    isQuastion: false,
                  }));
                  setValueTask(false);
                }}
                color="secondary"
                icon="message"
                description="Chat"
              />
              <ButtonIcon
                onClick={() => {
                  setListTask((prev) => ({
                    ...prev,
                    isCompShopDep: !prev.isCompShopDep,
                    isChat: false,
                    isAttachment: false,
                    isObservable: false,
                    isQuastion: false,
                  }));
                  setValueTask(false);
                }}
                color="secondary"
                icon="shop"
                description="Comp/Loj/Dep"
              />
            </div>
            {valueTask && (
              <SubTasksWithCheckbox
                message={props.message}
                subTasks={taskDetails.data?.task_item || []}
                onTaskChange={(e) => console.log(e)}
                allData={props}
              />
            )}
          </div>
          {valueTask && (
            <div className="d-flex justify-content-between gap-3 pt-3 pb-2">
              <div className="w-100">
                <input
                  type="text"
                  className="form-control d-block"
                  onChange={(e) => setValueNewTask(e.target.value)}
                  value={valueNewTask}
                />
              </div>
              <div>
                <ButtonIcon
                  color="success"
                  description="Enviar"
                  icon="arrow-right"
                  onClick={handleAddTask}
                />
              </div>
              {/* <ButtonIcon title="Questão" color="secondary" icon="question" description="" onClick={() => {
                console.log('task');
              }} /> */}
            </div>
          )}
          {ListTask.isCompShopDep && (
            <div className="col-md-12 d-flex flex-column justify-content-between">
              <SelectTaskItem data={props.taskListFiltered} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ModalDefault: React.FC<TaskItem> = (props) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [_, seNotificationMessage] = useState<{
    message: string;
    error: boolean;
  }>({
    message: "",
    error: true,
  });

  const { task, taskPercent, messageNotification } = useWebSocket();

  useEffect(() => {
    if (messageNotification && messageNotification.object?.description) {
      setNotification(messageNotification.object?.description);
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="zIndex99">
      {notification && (
        <div className="position-absolute">
          {/* <Modalnotification
            message={
              notificationMessage.error
                ? notificationMessage.message
                : "Dados enviados com sucesso!"
            }
            title={
              !notificationMessage.error ? "Dados enviados" : "Erro ao enviar"
            }
            whichType={!notificationMessage.error ? "success" : "danger"}
            user="Jonatas"
          /> */}
        </div>
      )}
      <div className="card modal-card-default">
        <section className="header-modal-default">
          <HeaderModal
            color="danger"
            description={task.description}
            onClick={props.close_modal}
          />
          <ProgressBar progressValue={taskPercent} />
        </section>
        <section className="body-modal-default h-100">
          <BodyDefault
            message={seNotificationMessage}
            details={props.details}
            taskListFiltered={task || []}
          />
        </section>
      </div>
    </div>
  );
};

export default ModalDefault;
