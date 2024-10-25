import React, { useState, useEffect } from 'react';
import "./style.css";
import AvatarGroup from '../Avatar/avatar';
import { SubTask, TaskItem } from './Types';
import HeaderModal from './Header';
import ProgressBar from './Progressbar';
import FormTextAreaDefault from './FormTextAraeaDefault';
import SubTasksWithCheckbox from './SubtaskWithCheckbox';
import SelectTaskItem from './SelectTaskItem';
import { Connection } from '../../../../Connection/Connection';
import { useMyContext } from '../../../../Context/MainContext';

interface BodyDefaultProps {
  disabledForm?: boolean;
  listSubTasks?: { data: { task_item?: any, full_description: string, task_user: any[] } };
  taskListFiltered?: any;
  taskCheckReset?: any;
  reset?: any;
}

const BodyDefault: React.FC<BodyDefaultProps> = ({
  disabledForm = false,
  listSubTasks = { data: { task_item: [], full_description: "", task_user: [] } },
  taskListFiltered,
  reset,
  taskCheckReset,
}) => {
  const [subTasks, setSubTasks] = useState<SubTask[]>(listSubTasks?.data?.task_item || []); // listSubTasks?.data?.task_item ||
  const [valueNewTask, setValueNewTask] = useState<string>("");

  const connection = new Connection("18", true);

  // aqui faz apaarecer as tarefas do para tikar 
  useEffect(() => {
    if (listSubTasks?.data?.task_item) {
      setSubTasks(listSubTasks?.data?.task_item);
    }

  }, [listSubTasks?.data?.task_item]);

  const handleTaskChange = (id: number, check: boolean) => {
    setSubTasks((prevSubTasks) => prevSubTasks.map((task) => (task.id === id ? { ...task, check } : task)));
  };

  const handleAddTask = async () => {
    if (valueNewTask.length > 0) {
      try {
        await connection.post(
          { description: valueNewTask, file: null, task_id: taskListFiltered.id },
          "GTPP/TaskItem.php"
        );
        setValueNewTask("");
        reset();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  return (
    <div className="row mt-3 h-100 overflow-hidden p-4">
      <div className="col-md-6 overflow-hidden">
        <FormTextAreaDefault
          task_description={listSubTasks?.data?.full_description || ""}
          disabledForm={disabledForm}
        />
        <SubTasksWithCheckbox subTasks={subTasks} onTaskChange={handleTaskChange} />
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
            <button onClick={handleAddTask} className="btn btn-success">
              Enviar
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6 h-100 position-relative">
        <SelectTaskItem data={taskListFiltered} />
        <div className="position-absolute position-box-users">
          {/* <AvatarGroup dataTask={taskListFiltered} users={listSubTasks?.data?.task_user ? listSubTasks?.data?.task_user : []} /> */}
        </div>
      </div>
    </div>
  );
};

const ModalDefault: React.FC<TaskItem> = (props) => {
  const {setNewProgressBar,newProgressBar} = useMyContext();
  useEffect(()=>{
    setNewProgressBar(props.taskFilter.percent || 0)
  },[props]);

  return (
    <div className='zIndex99'>
      <div className="card w-75 overflow-hidden position-absolute modal-card-default">
        <section className='header-modal-default'>
          <HeaderModal
            color='danger'
            description={props.taskFilter.description}
            onClick={props.close_modal}
          />
          <ProgressBar progressValue={newProgressBar || 0} />
        </section>
        <section className='body-modal-default'>
          <BodyDefault taskCheckReset={props.taskCheckReset} reset={props.resetTask} taskListFiltered={props.taskFilter} listSubTasks={props.listItem || []}/>
        </section>
      </div>
    </div>
  );
};

export default ModalDefault;