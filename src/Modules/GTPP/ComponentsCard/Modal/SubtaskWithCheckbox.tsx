import React from "react";
import { InputCheckbox } from "../../../../Components/CustomForm";
import { SubTasksWithCheckboxProps } from "./Types";
import { Connection } from "../../../../Connection/Connection";
import { useMyContext } from "../../../../Context/MainContext";

const SubTasksWithCheckbox: React.FC<SubTasksWithCheckboxProps> = ({ subTasks, onTaskChange }) => {
    const connection = new Connection("18", true);
    const { webSocketInstance } = useMyContext();
    
    const handleCheckboxChange = async (id: number, checked: boolean, idTask: any ) => {
      onTaskChange(id, checked);

      let result = await connection.put({
        check: checked,
        id: id,
        task_id: idTask
      }, "GTPP/TaskItem.php");

      webSocketInstance.send({result: result});

      // @ts-ignore
      localStorage.setItem("percent",JSON.stringify(result));
    };
  
    return (
      <div className='overflow-auto mt-3' style={{height: '176px'}}>
        {subTasks.map((task, index: number) => (
          <div key={task.id} className="d-flex gap-2 align-items-center mb-2">
            <InputCheckbox
              label={task.description}
              onChange={(e: any) => handleCheckboxChange(task.id, e.target.checked, task.task_id)}
              value={task.check}
              key={index} 
            />
          </div>
        ))}
      </div>
  )};

export default SubTasksWithCheckbox;