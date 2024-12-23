import React, { useState } from "react";
import { InputCheckbox } from "../../../../Components/CustomForm";
import { SubTasksWithCheckboxProps } from "./Types";
import { useWebSocket } from "../../Context/GtppWsContext";
import ButtonIcon from "../Button/ButtonIcon/btnicon";
import ModalGender from "../ModalGender/ModalGender";


const SubTasksWithCheckbox: React.FC<SubTasksWithCheckboxProps> = ({
  subTasks,
  allData,
  message
}) => {
  const { checkedItem, changeObservedForm } = useWebSocket();
  const [selectedOption, setSelectedOption] = useState("description");

  const [subTask, setSubtask] = useState<{
    isObservable: boolean,
    isQuestion: boolean,
    isAttachment: boolean,
    text: string,
    idSubTask: string | number,
    openDialog: boolean,
  }>({
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

  const ModalEdit = () => {
    return (
      <ModalGender
        isOpen={subTask.isObservable}
        title={selectedOption === "observed" ? "Observação" : "Descrição"}
        onSave={() => {
          changeObservedForm(allData.taskListFiltered.id, subTask.idSubTask, subTask.text, message, selectedOption);
        }}
        onClose={() => {
          setSubtask((prev) => ({...prev, isObservable: false}));
        }}
        children={(
          <div>
            <textarea 
              placeholder={selectedOption === "observed" ? "Digite aqui sua observação..." : "faça seu ajuste na descrição..."} 
              onChange={(e) => setSubtask((prev) => ({...prev, text: e.target.value}))}></textarea>
          </div>
        )}
        childrenButton={(
          <>
            <div className="d-flex justify-content-center flex-column">
              <div><input type="radio" className="radio" value="description" checked={selectedOption === "description"} onChange={handleRadioChange}/> <strong>Descrição</strong></div>
              <div><input type="radio" className="radio"value="observed" checked={selectedOption === "observed"} onChange={handleRadioChange}/> <strong>Observação</strong></div>
            </div>
          </>
        )}
      />
    );
  }

  const ModalInformation = ({description}: {description: string}) => {
    return (
      <div className="cloud-balloon">
        <div className="cloud-content">
          {description}
        </div>
      </div>
    );
  };
  
  

  return (
    <div className="overflow-auto mt-3 border-secondary rounded taskGtpp">
      <ModalEdit />
      {subTasks.map((task, index: number) => (
        <div key={task.id} className="d-flex justify-content-between gap-2 align-items-center mb-2 position-relative">
          {(subTask.openDialog && subTask.idSubTask === task.id && task.note) && <ModalInformation description={task.note} />}

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
          <div className="d-flex gap-2">
            <ButtonIcon title="Observação" color={task.note ? "success" : "secondary"} icon="eye" description="" onClick={() => {
              setSubtask((prev) => ({...prev, openDialog: !prev.openDialog}));
              setSubtask((prev) => ({...prev, idSubTask: task.id}));
            }} />
            <ButtonIcon title="Observação" color="secondary" icon="bars" description="" onClick={() => {
              setSubtask((prev) => ({...prev, idSubTask: task.id}));
              setSubtask((prev) => ({...prev, isObservable: !prev.isObservable, isAttachment: false, isQuestion: false}));
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubTasksWithCheckbox;
