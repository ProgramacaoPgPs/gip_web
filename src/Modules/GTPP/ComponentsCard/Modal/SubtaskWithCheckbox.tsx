import React from "react";
import { InputCheckbox } from "../../../../Components/CustomForm";
import { SubTasksWithCheckboxProps } from "./Types";
import { Connection } from "../../../../Connection/Connection";
import { useMyContext } from "../../../../Context/MainContext";

const SubTasksWithCheckbox: React.FC<SubTasksWithCheckboxProps> = ({ subTasks, onTaskChange }) => {
    const connection = new Connection("18", true);
    const { webSocketInstance } = useMyContext();
    
    const handleCheckboxChange = async (id: number, checked: boolean, idTask: any, task: any ) => {
      onTaskChange(id, checked);

      let result = await connection.put({
        check: checked,
        id: id,
        task_id: idTask
      }, "GTPP/TaskItem.php");

      webSocketInstance.send({data: {
        // user_id: localStorage?.userGTPP,
        object: {
            description: task.check ? "Um item foi marcado" : "Um item foi desmarcado",
            // @ts-ignore
            percent: result.data?.percent,
            itemUp: task
        },
        task_id: idTask,
        type: 2
      }});
    };
  
    return (
      <div className='overflow-auto mt-3' style={{height: '176px'}}>
        {subTasks.map((task, index: number) => (
          <div key={task.id} className="d-flex gap-2 align-items-center mb-2">
            <InputCheckbox
              label={task.description}
              onChange={(e: any) => handleCheckboxChange(task.id, e.target.checked, task.task_id, task)}
              value={task.check}
              key={index} 
            />
          </div>
        ))}
      </div>
  )};

export default SubTasksWithCheckbox;