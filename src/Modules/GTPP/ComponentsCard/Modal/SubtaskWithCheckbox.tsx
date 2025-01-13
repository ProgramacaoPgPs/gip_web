import React, { useState } from "react";
import { InputCheckbox } from "../../../../Components/CustomForm";
import { SubTasksWithCheckboxProps } from "./Types";
import { useWebSocket } from "../../Context/GtppWsContext";
import ButtonIcon from "../Button/ButtonIcon/btnicon";
import ModalGender from "../ModalGender/ModalGender";
import AnexoImage from "../AnexoImage/AnexoImage";
import ConfirmModal from "../../../../Components/CustomConfirm";

interface iSubTask {
  isObservable: boolean;
  isQuestion: boolean;
  isAttachment: boolean;
  text: string;
  idSubTask: string | number;
  openDialog: boolean
}

const SubTasksWithCheckbox: React.FC<SubTasksWithCheckboxProps> = ({
  subTasks,
  allData,
  message
}) => {
  const { checkedItem, changeObservedForm } = useWebSocket();
  const [selectedOption, setSelectedOption] = useState("description");
  const [editTask, setEditTask] = useState<any>("");
  const [isObservation, setIsObservation] = useState<boolean>(false);
  const [onEditTask, setOnEditTask] = useState<boolean>(false);


  const [subTask, setSubtask] = useState<iSubTask>({
    isObservable: false,
    isQuestion: false,
    isAttachment: false,
    text: "",
    idSubTask: "",
    openDialog: false
  });

  const handleRadioChange = (event: any) => {
    setSelectedOption(event.target.value);
  }


  const ModalEdit = (props: any) => {
    const { task, setEditTask } = props;
    return (
      <ModalGender
        isOpen={subTask.isObservable}
        title={selectedOption === "observed" ? "Observação" : "Descrição"}
        onSave={() => {
          // changeObservedForm(allData.taskListFiltered.id, subTask.idSubTask, subTask.text, message, selectedOption);
        }}
        onClose={() => {
          setSubtask((prev) => ({ ...prev, isObservable: false }));
        }}
        children={(
          <div>
            <textarea
              value={selectedOption === "observed" ? task.note : task.description}
              placeholder={selectedOption === "observed" ? "Digite aqui sua observação..." : "faça seu ajuste na descrição..."}
              onChange={(e) => {
                e.preventDefault();
                // setSubtask((prev) => ({ ...prev, text: e.target.value }));
                task.note = e.target.value
                setEditTask({ ...task });
              }}></textarea>
          </div>
        )}
        childrenButton={(
          <React.Fragment>
            <div className="d-flex justify-content-center flex-column">
              <div><input type="radio" className="radio" value="description" checked={selectedOption === "description"} onChange={handleRadioChange} /> <strong>Descrição</strong></div>
              <div><input type="radio" className="radio" value="observed" checked={selectedOption === "observed"} onChange={handleRadioChange} /> <strong>Observação</strong></div>
            </div>
          </React.Fragment>
        )}
      />
    );
  }

  const ModalInformation = (props: any) => {
    return (
      <div onClick={() => props.onClose(props.task)} className="cloud-balloon w-50 rounded p-2">
        <div className="cloud-content overflow-auto h-75">
          {props.description}
        </div>
        <div className="d-flex align-items-center justify-content-center h-25 ">
          <button className="d-block btn btn-danger">Fechar</button>
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
        {confirm && <ConfirmModal {...msgConfirm} onConfirm={()=>setIsObservation(!isObservation)} onClose={() => setConfirm(false)} />}
        <div
          style={{
            maxHeight: "75%"
          }}
          className="d-flex flex-column align-items-center bg-white col-10 col-sm-8 col-md-6 col-lg-5 col-xl-3 p-4 rounded">
          <header className="d-flex align-items-center justify-content-between w-100">
            <h1>Editar item da tarefa</h1>
            <button onClick={() => onClose()} className="btn btn-danger py-0">Fechar</button>
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
            <textarea
              onChange={(event) => {
                const value = event.target.value;
                isObservation ? setNote(value) : setDescription(value);
              }}
              value={isObservation ? note : description}
            />
          </section>
          <button onClick={() => {
            if (editTask.description != description || editTask.note != note) {
              const value = editTask.description != description ? description : note;
              changeObservedForm(editTask.task_id, editTask.id, value, isObservation);
              editTask[isObservation?'note':'description'] = value;
              setEditTask({...editTask});
            }
          }} className="btn btn-success col-10 col-sm-8 col-md-6 col-lg-5 col-xl-3">Salvar</button>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-auto my-2 border-secondary rounded flex-grow-1">
      <div>
        {/* <ModalEdit setEditTask={setEditTask} task={editTask} /> */}
        <ModalEditTask onEditTask={onEditTask} onClose={() => setOnEditTask(false)} isObservation={isObservation} setIsObservation={setIsObservation} editTask={editTask} setEditTask={setEditTask} />
        {subTasks.map((task, index: number) => (
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
                      task.id,
                      e.target.checked,
                      task.task_id,
                      task
                    );
                  }}
                  value={task.check}
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
                // setSubtask((prev) => ({ ...prev, isObservable: !prev.isObservable, isAttachment: false, isQuestion: false, openDialog: false, idSubTask: task.id }));
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
};

export default SubTasksWithCheckbox;
