import React, { useState, useEffect, useMemo } from 'react';
import "./style.css";
import AvatarGroup from '../Avatar/avatar';
import { SubTask, TaskItem } from './Types';
import HeaderModal from './Header';
import ProgressBar from './Progressbar';
import FormTextAreaDefault from './FormTextAraeaDefault';
import SubTasksWithCheckbox from './SubtaskWithCheckbox';
import SelectTaskItem from './SelectTaskItem';
import { Connection } from '../../../../Connection/Connection';
import useConnect from '../../hook/webSocketConnect';

interface BodyDefaultProps {
  disabledForm?: boolean;
  renderList?: any;
  listSubTasks?: { data: { task_item?: any, full_description: string, task_user: any[] } };
  taskListFiltered?: any;
  taskCheckReset?: any;
  setRenderList?: any;
  getPercent?: any;
  reset?: any;
}

const BodyDefault: React.FC<BodyDefaultProps> = (props) => {
  const [subTasks, setSubTasks] = useState<SubTask[]>(props.listSubTasks?.data?.task_item || []); 
  const [valueNewTask, setValueNewTask] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const connection = new Connection("18", true);

  useEffect(() => {
    if (props.listSubTasks?.data?.task_item) {
      setSubTasks(props.listSubTasks?.data?.task_item);
    }

  }, [props.listSubTasks?.data?.task_item]);

  const handleTaskChange = (id: number, check: boolean) => {
    setSubTasks((prevSubTasks) => prevSubTasks.map((task) => (task.id === id ? { ...task, check } : task)));
  };

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

  return (
    <div className="row mt-3 h-100 overflow-hidden p-4">
      <div className="col-md-12 row m-auto container h-100 overflow-hidden w-100"> 
       <div className="col-md-6"> 
        <FormTextAreaDefault task_description={props.listSubTasks?.data?.full_description || ""} disabledForm={props.disabledForm} />
        <SubTasksWithCheckbox getPercent={props.getPercent} setRenderList={props.setRenderList} subTasks={subTasks} onTaskChange={handleTaskChange} />
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
  const [data, setData] = useState<any>();
  const [percent, getPercent] = useState<any>(0);
  const connection = useMemo(() => new Connection("18", true), []);
  
  useEffect(() => {
    async function getTaskInformations() {
      try {
        const getTaskItem = await connection.get(
          `&id=${props.taskFilter.id.toString()}`,
          "GTPP/Task.php"
        );
        console.log(getTaskItem);
        setData(getTaskItem);
      } catch (error) {
        console.error("Erro ao obter as informações da tarefa:", error);
      }
    }
    return () => {
      getTaskInformations();
    }
  }, [props, connection]);

  return (
    <div className='zIndex99'>
      <div className="card w-75 overflow-hidden position-absolute modal-card-default">
        <section className='header-modal-default'>
          <HeaderModal color='danger' description={props.taskFilter.description} onClick={props.close_modal}/>
          <ProgressBar progressValue={percent > 0 ? percent : props.taskFilter.percent} />
        </section>
        <section className='body-modal-default'>
          <BodyDefault getPercent={getPercent} setRenderList={props.setRenderList} taskListFiltered={props.taskFilter || []} listSubTasks={data || []}/>
        </section>
      </div>
    </div>
  );
};

export default ModalDefault;