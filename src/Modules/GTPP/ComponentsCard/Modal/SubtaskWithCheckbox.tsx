import React, { useState } from "react";
import { InputCheckbox } from "../../../../Components/CustomForm";
import { SubTasksWithCheckboxProps } from "./Types";
import { useWebSocket } from "../../Context/GtppWsContext";
import Observer from "../Observer/Observer";
import ButtonIcon from "../Button/ButtonIcon/btnicon";


const SubTasksWithCheckbox: React.FC<SubTasksWithCheckboxProps> = ({
  subTasks,
  allData
}) => {
  const { checkedItem, changeObservedForm } = useWebSocket();

  const [subTask, setSubtask] = useState<{
    isObservable: boolean,
    isQuestion: boolean,
    isAttachment: boolean,
    text: string,
    idSubTask: string | number,
  }>({
    isObservable: false,
    isQuestion: false,
    isAttachment: false,
    text: "",
    idSubTask: "",
  });

  return (
    <div className="overflow-auto mt-3 border-secondary rounded taskGtpp">
      <Observer
        title="Digite a mudança da tarefa"
        text={subTask.text}
        setText={(value: string) => setSubtask((prev) => ({ ...prev, text: value }))}
        isOpen={subTask.isObservable}
        onClose={() => setSubtask((prev) => ({ ...prev, isObservable: false }))}
        onSave={async (text) => {
          try {
            changeObservedForm(allData.taskListFiltered.id, subTask.idSubTask, text);
            setSubtask((prev) => ({ ...prev, isObservable: false }));
          } catch (error) {
            console.log(error);
          }
        }}
        
      />

      {subTasks.map((task, index: number) => (
        <div key={task.id} className="d-flex justify-content-between gap-2 align-items-center mb-2">
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
            }}
            value={task.check}
            key={index}
          />
          <div className="d-flex gap-2">
            <ButtonIcon title="Observação" color="secondary" icon="book" description="" onClick={() => {
              setSubtask((prev) => ({...prev, idSubTask: task.id}))
              setSubtask((prev) => ({...prev, isObservable: !prev.isObservable, isAttachment: false, isQuestion: false}));
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubTasksWithCheckbox;
