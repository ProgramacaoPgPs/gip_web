import React, { useState } from 'react';
import "./style.css";
import AvatarGroup from '../Avatar/avatar';
import { TaskItem } from './Types';
import HeaderModal from './Header';
import ProgressBar from './Progressbar';
import FormTextAreaDefault from './FormTextAraeaDefault';
import SubTasksWithCheckbox from './SubtaskWithCheckbox';
import SelectTaskItem from './SelectTaskItem';
import { Connection } from '../../../../Connection/Connection';
import { useWebSocket } from '../../Context/GtppWsContext';

interface BodyDefaultProps {
  disabledForm?: boolean;
  renderList?: any;
  listSubTasks?:any;
  taskListFiltered?: any;
  taskCheckReset?: any;
  setRenderList?: any;
  getPercent?: any;
  reset?: any;
  details?: any;
}

const BodyDefault: React.FC<BodyDefaultProps> = (props) => {
  const [valueNewTask, setValueNewTask] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const {taskDetails, task} = useWebSocket();
  
  const connection = new Connection("18", true);

  const handleAddTask = async () => {
    if (valueNewTask.length > 0) {
      try {
        await connection.post({ description: valueNewTask, file: null, task_id: props.taskListFiltered.id },"GTPP/TaskItem.php");
        setValueNewTask("");
        props.reset();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  //console.log(props.details.data.full_description);

  return (
    <div className="row mt-3 h-100 overflow-hidden p-4">
      <div className="col-md-12 row m-auto container h-100 overflow-hidden w-100"> 
       <div className="col-md-6"> 
        <FormTextAreaDefault task={props.taskListFiltered} details={props.details.data} disabledForm={props.disabledForm} />
        <SubTasksWithCheckbox subTasks={taskDetails.data?.task_item || []} onTaskChange={(e)=>console.log(e)} />
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
            <button onClick={handleAddTask} className="btn btn-success">Enviar</button>
          </div>
        </div>
       </div>
       <div className='col-md-6 d-flex flex-column justify-content-between'>
        <SelectTaskItem data={props.taskListFiltered} />
        <div className="">
          <div className='p-1 d-flex align-items-center justify-content-between'>
            <div>
              {isOpenModal && <div className='modal bg-light w-100'>teste</div>}
              <button onClick={() => {setIsOpenModal((prev:any) => !prev)}} className='btn btn-transparent'><i className={`fa fa-${isOpenModal ? 'calendar' : 'power-off'} ${isOpenModal ? 'text-success' : 'text-danger'}`}></i></button>
            </div>
            <div><AvatarGroup dataTask={props.taskListFiltered} users={props.listSubTasks?.data?.task_user ? props.listSubTasks?.data?.task_user : []} /></div>
          </div>
        </div>
       </div>
      </div>
    </div>
  );
};

const ModalDefault: React.FC<TaskItem> = (props) => {
  const [percent, getPercent] = useState<any>(0);
  
  // Modified by Hygor
  console.log(props.details);

  const {task,taskPercent} = useWebSocket();

  return (
    <div className='zIndex99'>
      <div className="card w-75 overflow-hidden position-absolute modal-card-default">
        <section className='header-modal-default'>
          <HeaderModal color='danger' description={task.description} onClick={props.close_modal}/>
          <ProgressBar progressValue={taskPercent} />
        </section>
        <section className='body-modal-default'>
          <BodyDefault details={props.details} getPercent={getPercent} setRenderList={props.setRenderList} taskListFiltered={task || []}/>
        </section>
      </div>
    </div>
  );
};

export default ModalDefault;