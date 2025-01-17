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
import AttachmentFile from "../../../../Components/AttachmentFile";

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
  const [attachmentFile, setAttachmentFile] = useState<string>('');
  const { taskDetails, stopAndToBackTask, handleAddTask } = useWebSocket();

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
    <div className="d-flex flex-column h-100 p-2">
      <div style={{ height: "10%" }} className="d-flex justify-content-between align-items-center my-2">
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
                props.taskListFiltered.state_id == 1 || props.taskListFiltered.state_id == 2
                  ? "text"
                  : props.taskListFiltered.state_id == 5
                    ? "number"
                    : null
              }
              title={
                props.taskListFiltered.state_id == 1 || props.taskListFiltered.state_id == 2
                  ? "Alterar tarefa para o estado Parado (informe o motivo)?"
                  : props.taskListFiltered.state_id == 4
                    ? "Por quê deseja reabrir a tarefa?"
                    : props.taskListFiltered.state_id == 3
                      ? "Deseja finalizar essa tarefa?"
                      : props.taskListFiltered.state_id == 5
                        ? "Insira o total de dias que você precisa."
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
              onClose={() =>
                setListTask((prev) => ({
                  ...prev,
                  openModalQuastionTask: !prev.openModalQuastionTask,
                }))
              }
              openClock={ListTask}
              isInput={props.taskListFiltered.state_id != 3}
              onClick={() => {
                try {
                  if (props.taskListFiltered.state_id != 3) throw new Error("Preencha o campo obrigatório");
                  let object: { taskId: number, resource: string | null, date: string | null, taskList: any } = {
                    taskId: props.taskListFiltered?.id,
                    resource: null,
                    date: null,
                    taskList: props.taskListFiltered
                  };

                  switch (props.taskListFiltered.state_id) {
                    case 4:
                      object.resource = null;
                      object.date = null;
                      break;
                    case 5:
                      object.resource = "";
                      object.date = ListTask.description;
                      break;
                    default:
                      object.resource = ListTask.description;
                      object.date = null;
                      break;
                  }
                  stopAndToBackTask(object.taskId, object.resource, object.date, object.taskList);
                  setListTask((prev) => ({
                    ...prev,
                    openModalQuastionTask: !prev.openModalQuastionTask,
                  }));

                } catch (error) {
                  alert(error);
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
              ) : props.taskListFiltered.state_id == 1 || props.taskListFiltered.state_id == 2 ? (
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
      <div style={{ height: "90%" }} className="d-flex flex-column justify-content-between">
        <FormTextAreaDefault
          task={props.taskListFiltered}
          details={props?.details?.data}
          disabledForm={props.disabledForm}
        />
        <div className="d-flex flex-column h-75">
          <div className="d-flex flex-wrap gap-2 my-2">
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
              onTaskChange={(e) => console.log(e)}
              allData={props}
            />
          )}
        </div>
        {valueTask && (
          <div style={{ height: "10%" }} className="d-flex justify-content-between align-items-center">
            <div className="mx-2">
              <ButtonIcon
                color="success"
                description=""
                icon="arrow-right"
                onClick={
                  async () => {
                    await handleAddTask(valueNewTask, props.taskListFiltered.id, attachmentFile);
                    setValueNewTask("");
                    setAttachmentFile("");
                  }
                }
              />
            </div>
            <AttachmentFile reset={attachmentFile ? false : true} file={0} onClose={(value) => setAttachmentFile(value)} />
            <div className="w-100 mx-2">
              <input
                type="text"
                className="form-control d-block"
                onChange={(e) => setValueNewTask(e.target.value)}
                value={valueNewTask}
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
    <div className="zIndex99 row">
      <div className="col-11 col-sm-10 col-md-8 col-lg-8 col-xl-6 h-100" style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: "calc((1vh + 1vw) / 2)"
      }}>

        <section style={{ height: "10%" }} className="header-modal-default my-2">
          <HeaderModal
            color="danger"
            description={task.description}
            task={task}
            onClick={props.close_modal}
          />
          <ProgressBar progressValue={taskPercent} colorBar="#00A875" />
        </section>
        <section style={{ height: "90%", overflow: "auto", backgroundColor: 'white' }} className="d-felx body-modal-default">
          <BodyDefault message={seNotificationMessage} details={props.details} taskListFiltered={task || []} />
        </section>
      </div>
    </div>
  );
};

export default ModalDefault;
