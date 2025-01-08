import React, { useEffect, useState } from "react";
import "./style.css";
import AvatarGroup from "../Avatar/avatar";
import { TaskItem } from "./Types";
import HeaderModal from "./Header";
import ProgressBar from "./Progressbar";
import FormTextAreaDefault from "./FormTextAraeaDefault";
import SubTasksWithCheckbox from "./SubtaskWithCheckbox";
import SelectTaskItem from "./SelectTaskItem";
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
  const [valueTask, setValueTask] = useState<boolean>(true);
  const { taskDetails, task, stopAndToBackTask, handleAddTask } = useWebSocket();

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
                    : props.taskListFiltered.state_id == 3
                      ? "Deseja finalizar essa tarefa?"
                      : props.taskListFiltered.state_id == 5
                        ? "Insira o total de dias que voce precisa"
                        : props.taskListFiltered.state_id == 6
                          ? "Deseja mesmo retomar a tarefa?"
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
              ) : props.taskListFiltered.state_id == 3 ? (
                <ButtonIcon
                  color="success"
                  icon="check"
                  description="Deseja finalizar a tarefa?"
                />
              ) : props.taskListFiltered.state_id == 6 ? (
                <ButtonIcon
                  color="dark"
                  icon="arrow-left"
                  description="Deseja retomar a tarefa?"
                />
              ) : props.taskListFiltered.state_id == 7 ? (
                <ButtonIcon
                  color="dark"
                  icon="arrow-left"
                  description="Descancelar tarefa"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12 row m-auto container overflow-hidden h-100">
        <div className="col-md-12 h-100">
          <FormTextAreaDefault
            task={props.taskListFiltered}
            details={props?.details?.data}
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
                  onClick={() => {
                      handleAddTask(valueNewTask, props.taskListFiltered.id);
                      setValueNewTask("");
                    }
                  }
                />
              </div>
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
  const [_, seNotificationMessage] = useState<{
    message: string;
    error: boolean;
  }>({
    message: "",
    error: true,
  });

  const { task, taskPercent } = useWebSocket();

  return (
    <div className="zIndex99">
      <div className="card modal-card-default">
        <section className="header-modal-default">
          <HeaderModal
            color="danger"
            description={task.description}
            task={task}
            onClick={props.close_modal}
          />
          <ProgressBar progressValue={taskPercent} />
        </section>
        <section className="body-modal-default h-100">
          <BodyDefault message={seNotificationMessage} details={props.details} taskListFiltered={task || []} />
        </section>
      </div>
    </div>
  );
};

export default ModalDefault;
