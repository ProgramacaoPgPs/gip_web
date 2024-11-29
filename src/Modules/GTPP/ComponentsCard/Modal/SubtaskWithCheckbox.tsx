import React from "react";
import { InputCheckbox } from "../../../../Components/CustomForm";
import { SubTasksWithCheckboxProps } from "./Types";
import { useWebSocket } from "../../Context/GtppWsContext";


const SubTasksWithCheckbox: React.FC<SubTasksWithCheckboxProps> = ({
  subTasks,
}) => {
  const { checkedItem } = useWebSocket();

  return (
    <div className="overflow-auto mt-3" style={{ height: "176px" }}>
      {subTasks.map((task, index: number) => (
        <div key={task.id} className="d-flex gap-2 align-items-center mb-2">
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
        </div>
      ))}
    </div>
  );
};

export default SubTasksWithCheckbox;
