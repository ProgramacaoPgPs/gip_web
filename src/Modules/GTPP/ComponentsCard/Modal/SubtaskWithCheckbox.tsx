import React, { useEffect, useRef, useState } from "react";
import { InputCheckbox } from "../../../../Components/CustomForm";
import { SubTasksWithCheckboxProps } from "./Types";
import { useWebSocket } from "../../Context/GtppWsContext";
import ButtonIcon from "../Button/ButtonIcon/btnicon";
import AnexoImage from "../AnexoImage/AnexoImage";
import ConfirmModal from "../../../../Components/CustomConfirm";
import { Connection } from "../../../../Connection/Connection";
import { useMyContext } from "../../../../Context/MainContext";

interface iSubTask {
  isObservable: boolean;
  isQuestion: boolean;
  isAttachment: boolean;
  text: string;
  idSubTask: string | number;
  openDialog: boolean
}

const SubTasksWithCheckbox: React.FC<SubTasksWithCheckboxProps> = () => {
  const { checkedItem, changeObservedForm, taskDetails, setTaskDetails, setTaskPercent, getTask, setGetTask, deleteItemTaskWS } = useWebSocket();
  const { setLoading } = useMyContext();
  const [editTask, setEditTask] = useState<any>("");
  const [isObservation, setIsObservation] = useState<boolean>(false);
  const [onEditTask, setOnEditTask] = useState<boolean>(false);
  const containerTaskItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerTaskItemsRef.current) {
      containerTaskItemsRef.current.scrollTop = containerTaskItemsRef.current.scrollHeight;
    }
  }, [taskDetails]);

  const [subTask, setSubtask] = useState<iSubTask>({
    isObservable: false,
    isQuestion: false,
    isAttachment: false,
    text: "",
    idSubTask: "",
    openDialog: false
  });

  const ModalInformation = (props: any) => {
    return (
      <div onClick={() => props.onClose(props.task)} className="cloud-balloon w-50 rounded p-2">
        <div className="cloud-content overflow-auto h-75">
          {props.description}
        </div>
        <div className="d-flex align-items-center justify-content-center h-25 ">
          <button className="d-block btn btn-danger mt-3">Fechar</button>
        </div>
      </div>
    );
  };
  function ModalEditTask(props: any) {
    const { onEditTask, editTask, setEditTask, isObservation, setIsObservation, onClose } = props;
    const [note, setNote] = useState<string>(editTask.note);
    const [description, setDescription] = useState<string>(editTask.description);
    const [confirm, setConfirm] = useState<boolean>(false);
    const [msgConfirm, setMsgConfirm] = useState<{ title: string, message: string }>({ title: '', message: '' });
    return onEditTask && (
      <div className="d-flex align-items-center justify-content-center" style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        background: "#00000088",
        top: 0,
        left: 0
      }}>
        {confirm && <ConfirmModal {...msgConfirm} onConfirm={() => setIsObservation(!isObservation)} onClose={() => setConfirm(false)} />}
        <div
          style={{
            maxHeight: "75%"
          }}
          className="d-flex flex-column align-items-center bg-white col-10 col-sm-8 col-md-6 col-lg-5 col-xl-3 p-4 rounded">
          <header className="d-flex align-items-center justify-content-between w-100">
            <h1>Editar item da tarefa</h1>
            <button onClick={() => onClose()} className="btn btn-danger py-0">X</button>
          </header>
          <section className="w-100">
            <button onClick={() => {
              if (editTask.description != description || editTask.note != note) {
                setMsgConfirm({ title: "Atenção", message: "Salve os dados antes de trocar de aba" });
                setConfirm(true);
              } else {
                setIsObservation(!isObservation);
              }
            }} className={`btn btn-${isObservation ? 'primary' : 'secondary'} py-0`}>{isObservation ? "Observação" : "Descrição"}</button>
            <textarea rows={8} style={{ resize: "none" }} className="form-control my-4"
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                const value = event.target.value;
                isObservation ? setNote(value) : setDescription(value);
              }}
              value={(isObservation ? note : description) || ""}
              placeholder={`${isObservation ? "Escreva detalhes e observações desse item" : "Edite a descrição dessa tarefa."}`}
            />
          </section>
          <button onClick={() => {
            if (editTask.description != description || editTask.note != note) {
              const value = editTask.description != description ? description : note;
              changeObservedForm(editTask.task_id, editTask.id, value, isObservation);
              editTask[isObservation ? 'note' : 'description'] = value;
              setEditTask({ ...editTask });
              onClose();
            }
          }} className="btn btn-success col-10 col-sm-8 col-md-6 col-lg-5 col-xl-3">Salvar</button>
        </div>
      </div>
    );
  }
  return (
    <div ref={containerTaskItemsRef} className="overflow-auto my-2 rounded flex-grow-1">
      <div>
        <ModalEditTask onEditTask={onEditTask} onClose={() => setOnEditTask(false)} isObservation={isObservation} setIsObservation={setIsObservation} editTask={editTask} setEditTask={setEditTask} />
        {taskDetails.data?.task_item.map((task, index: number) => (
          <div
            key={task.id}
            className={"GIPP-section d-flex justify-content-between align-items-center mb-2 bg-light border w-100 p-2 rounded overflow-auto"}
          >
            {(subTask.openDialog && subTask.idSubTask === task.id && task.note) && <ModalInformation onClose={closeObservation} task description={task.note} />}
            <div className="GIPP-section-sm my-2">
              <div className="text-wrap text-break">
                <InputCheckbox
                  label={task.description}
                  onChange={(e: any) => {
                    checkedItem(
                      task.id || 0,
                      e.target.checked,
                      task.task_id,
                      task
                    );
                  }}
                  value={task.check || false}
                  key={index}
                />
              </div>
            </div>

            <div className="GIPP-aside-sm d-flex justify-content-end gap-2 my-2">
              {task.note &&
                <ButtonIcon title="Visualizar observação" color="primary" icon="circle-info" description="" onClick={() => {
                  closeObservation(task);
                }} />
              }
              <ButtonIcon title="Observação" color="primary" icon="pencil" description="" onClick={() => {
                setEditTask(task);
                setOnEditTask(true);
              }} />
              <ButtonIcon title="Observação" color="danger" icon="trash" description="" onClick={async () => {
                try {
                  setLoading(true);
                  if (task.id && task.task_id) {
                    const result = await deleteTaskItem({ id: task.id, task_id: task.task_id });
                    if (result.error) throw new Error(result.message);
                    setTaskPercent(parseInt(result.data.percent));
                    removeItemOfList(task.id);
                    getTask[getTask.findIndex(item => item.id == task.task_id)].percent = parseInt(result.data.percent);
                    setGetTask([...getTask]);
                    deleteItemTaskWS({
                      description: "Um item foi removido.",
                      itemUp: task.id,
                      percent:parseInt(result.data.percent),
                      remove: true
                    });
                  }
                } catch (error: any) {
                  alert(error.message);
                } finally {
                  setLoading(false);
                }
              }} />
              <AnexoImage />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
  function closeObservation(task: any) {
    setSubtask((prev) => ({ ...prev, idSubTask: task.id, openDialog: !prev.openDialog }));
  }

  async function deleteTaskItem(item: { id: number; task_id: number }) {
    const connection = new Connection('18');
    // const req: any = await connection.delete(`&id=${item.id}&task_id=${item.task_id}`, 'GTPP/TaskItem.php');
    const req: any = await connection.delete({ id: item.id, task_id: item.task_id }, 'GTPP/TaskItem.php');
    return req;
  }

  function removeItemOfList(id: number) {
    const indexDelete: number | undefined = taskDetails.data?.task_item.findIndex(item => item.id == id);
    if (indexDelete != undefined && indexDelete >= 0) {
      taskDetails.data?.task_item.splice(indexDelete, 1);
      setTaskDetails({ ...taskDetails });
    }
  }
};

export default SubTasksWithCheckbox;