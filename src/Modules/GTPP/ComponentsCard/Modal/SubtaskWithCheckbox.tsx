import React, { useState } from "react";
import { InputCheckbox } from "../../../../Components/CustomForm";
import { SubTasksWithCheckboxProps } from "./Types";
import { useWebSocket } from "../../Context/GtppWsContext";
import ButtonIcon from "../Button/ButtonIcon/btnicon";
import ModalGender from "../ModalGender/ModalGender";
import AnexoImage from "../AnexoImage/AnexoImage";

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
          setSubtask((prev) => ({ ...prev, isObservable: false }));
        }}
        children={(
          <div>
            <textarea
              placeholder={selectedOption === "observed" ? "Digite aqui sua observação..." : "faça seu ajuste na descrição..."}
              onChange={(e) => setSubtask((prev) => ({ ...prev, text: e.target.value }))}></textarea>
          </div>
        )}
        childrenButton={(
          <>
            <div className="d-flex justify-content-center flex-column">
              <div><input type="radio" className="radio" value="description" checked={selectedOption === "description"} onChange={handleRadioChange} /> <strong>Descrição</strong></div>
              <div><input type="radio" className="radio" value="observed" checked={selectedOption === "observed"} onChange={handleRadioChange} /> <strong>Observação</strong></div>
            </div>
          </>
        )}
      />
    );
  }

  const ModalInformation = ({ description }: { description: string }) => {
    return (
      <div className="cloud-balloon">
        <div className="cloud-content">
          {description}
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-auto my-2 border-secondary rounded flex-grow-1">
      <div>
        {ModalEdit()}
        {subTasks.map((task, index: number) => (
          <div
            key={task.id}
            className={"GIPP-section d-flex justify-content-between align-items-center mb-2 position-relative bg-light border w-100 p-3 rounded overflow-auto"}
          >
            {(subTask.openDialog && subTask.idSubTask === task.id && task.note) && <ModalInformation description={task.note} />}
            <div className="GIPP-section-sm">
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

            <div className="GIPP-aside-sm d-flex justify-content-around">
              <AnexoImage />
              <ButtonIcon title="Visualizar observação" color={task.note ? "success" : "secondary"} icon="eye" description="" onClick={() => {
                setSubtask((prev) => ({ ...prev, idSubTask: task.id, openDialog: !prev.openDialog }))
              }} />
              <ButtonIcon title="Observação" color="primary" icon="bars" description="" onClick={() => {
                setSubtask((prev) => ({ ...prev, isObservable: !prev.isObservable, isAttachment: false, isQuestion: false, openDialog: false, idSubTask: task.id }));
              }} />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SubTasksWithCheckbox;
