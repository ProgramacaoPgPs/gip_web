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
import Modalnotification from "../ModalNotification/Modalnotification";
import Observer from "../Observer/Observer";

interface BodyDefaultProps {
  disabledForm?: boolean;
  renderList?: any;
  listSubTasks?: any;
  taskListFiltered?: any;
  taskCheckReset?: any;
  setRenderList?: any;
  getPercent?: any;
  reset?: any;
  details?: any;
}

const BodyDefault: React.FC<BodyDefaultProps> = (props) => {
  const [valueNewTask, setValueNewTask] = useState<string>("");
  const [valueTask, setValueTask] = useState<boolean>(false);
  const { taskDetails, task, stopAndToBackTask } = useWebSocket();

  const [openClock, setOpenClock] = useState<{
    stopTask: boolean;
    openModalQuastionTask: boolean;
    description: string;
    isCompShopDep: boolean;
    isChat: boolean;
    isObservable: boolean;
    isQuastion: boolean;
    isAttachment: boolean;
  }>({
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
        await connection.post(
          {
            description: valueNewTask,
            file: null,
            task_id: props.taskListFiltered.id,
          },
          "GTPP/TaskItem.php"
        );
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
          {openClock.openModalQuastionTask ? (
            <MessageModal
              typeInput={
                props.taskListFiltered.state_id == 2 || props.taskListFiltered.state_id == 4 ? "text"
                : props.taskListFiltered.state_id == 5 ? "number" : null
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
                setOpenClock((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              openClock={openClock}
              onClick={() => {
                if (openClock.description.length > 0) {
                  stopAndToBackTask(
                    props.taskListFiltered?.id,
                    props.taskListFiltered.state_id == 4
                      ? null
                      : openClock.description,
                    props.taskListFiltered.state_id == 5 ? openClock.description : null,
                    props.taskListFiltered
                  );
                  setOpenClock((prev) => ({
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
                setOpenClock((prev) => ({...prev, openModalQuastionTask: !prev.openModalQuastionTask}))
              }}
            >
              {props.taskListFiltered.state_id == 4 ? (
                <ButtonIcon color="success" icon="power-off" description="Retomar tarefas" />
              ) : props.taskListFiltered.state_id == 2 ? (
                <ButtonIcon color="danger" icon="power-off" description="Parar tarefas" />
              ) : props.taskListFiltered.state_id == 5 ? (
                <ButtonIcon color="dark" icon="clock" description="Quantos dias precisa?" />
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
              <ButtonIcon onClick={() => {setOpenClock((prev) => ({...prev, isChat: false, isCompShopDep: false, isAttachment: false, isObservable: false, isQuastion: false})); setValueTask((prev) => !prev)}} color="secondary" icon="tasks" description="Tarefas" />
              <ButtonIcon onClick={() => {setOpenClock((prev) => ({...prev, isChat: !prev.isChat, isCompShopDep: false, isAttachment: false, isObservable: false, isQuastion: false})); setValueTask(false)}} color="secondary" icon="message" description="Chat" />
              <ButtonIcon onClick={() => {setOpenClock((prev) => ({...prev, isCompShopDep: !prev.isCompShopDep, isChat: false, isAttachment: false, isObservable: false, isQuastion: false})); setValueTask(false)}} color="secondary" icon="shop" description="Comp/Loj/Dep" />
            </div>
            {valueTask && (
              <SubTasksWithCheckbox
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
                <ButtonIcon color="success" description="Enviar" icon="arrow-right" onClick={handleAddTask} />
              </div>
              <ButtonIcon title="Questão" color="secondary" icon="question" description="" onClick={() => {
                console.log('task', )
              }} />
              <ButtonIcon title="Anexo" color="secondary" icon="newspaper" description="" onClick={() => console.log('Anexo 1')} />
            </div>
          )}
          {openClock.isCompShopDep && <div className="col-md-12 d-flex flex-column justify-content-between">
            <SelectTaskItem data={props.taskListFiltered} />
          </div>}
        </div>
      </div>
    </div>
  );
};

const ModalDefault: React.FC<TaskItem> = (props) => {
  const [percent, getPercent] = useState<any>(0);
  const [notification, setNotification] = useState<string | null>(null);

  const { 
    task, 
    taskPercent, 
    messageNotification 
  } = useWebSocket();

  useEffect(() => {
    if (messageNotification && messageNotification.object?.description) { setNotification(messageNotification.object?.description);
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [messageNotification]);

  return (
    <div className="zIndex99">
      {notification && (
        <div className="position-absolute">
          <Modalnotification 
            message={notification} 
            title="Tarefa feita com sucesso!" 
            whichType="success" 
            user="Jonatas" 
          />
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
            details={props.details}
            getPercent={getPercent}
            setRenderList={props.setRenderList}
            taskListFiltered={task || []}
          />
        </section>
      </div>
    </div>
  );
};


export default ModalDefault;
