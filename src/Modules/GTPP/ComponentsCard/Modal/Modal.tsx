import React, { useState, useEffect } from 'react';
import "./style.css";
import { Connection } from '../../../../Connection/Connection';
import { InputCheckbox, SelectField, SelectFieldDefault } from '../../../../Components/CustomForm';

type TaskItem = {
  card_id?: string;
  task_id?: string;
  description?: string;
  percent?: number;
  close_modal?: any;
  taskFilter?: any;
  listItem?: any;
}

type FormTextAreaDefaultProps = {
  disabledForm?: boolean;
  task_description: string;
  onChange?: (value: string) => void;
  buttonTextOpen?: string;
  buttonTextClosed?: string;
  buttonClasses?: string;
  textAreaClasses?: string;
  rows?: number;
  cols?: number;
}

type SubTask = {
  id: number;
  description: string;
  checked: boolean;
}

type SubTasksWithCheckboxProps = {
  subTasks: SubTask[];
  onTaskChange: (id: number, checked: boolean) => void;
}
  
const HeaderModal = (props: {color: string, description: string, OnClick: any}) => {
return (
  <div className='w-100'>
    <div className='d-flex justify-content-between align-items-center pt-2 px-2'>
      <div className='fs-1'>
        <h2>{props.description}</h2>
      </div>
      <div>
        <button onClick={props.OnClick ? props.OnClick : () => console.log('teste')} className={`bg-${props.color} btn text-light fa fa-x`} />
      </div>
    </div>

  </div>
)
}

const ProgressBar = (props: {progressValue: string | any}) => {
return (
  <div className="progress mt-2 mx-2">
    <div className="progress-bar" role="progressbar" style={{width: `${props.progressValue}%`}} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>{props.progressValue}%</div>
  </div>
)
}

const FormTextAreaDefault: React.FC<FormTextAreaDefaultProps> = (props) => {
const { disabledForm = false, task_description, onChange, buttonTextOpen = 'Aberto', buttonTextClosed = 'Trancado', buttonClasses = 'btn', textAreaClasses = 'form-control', rows = 5, cols = 10} = props;
const [isOpenButton, setIsOpenButton] = useState<boolean>(false);
const [value, setValueChange] = useState<string>(task_description);

useEffect(() => {
  setValueChange(task_description);
}, [task_description]);

const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const newValue = e.target.value;
  setValueChange(newValue);
  if (onChange) onChange(newValue);
};

return (
  <div className='d-flex align-items-end gap-2 mt-2 flex-column'>
    <textarea onChange={handleTextChange} disabled={disabledForm || !isOpenButton} value={value} className={textAreaClasses} cols={cols} rows={rows} />
    <button onClick={() => setIsOpenButton((prev: boolean) => !prev)} className={`${buttonClasses} btn-${isOpenButton ? 'success' : 'danger'}`}>
      {isOpenButton ? buttonTextOpen : buttonTextClosed}
    </button>
  </div>
);
};


const SubTasksWithCheckbox: React.FC<SubTasksWithCheckboxProps> = ({ subTasks, onTaskChange }) => {
  const handleCheckboxChange = (id: number, checked: boolean) => {
    onTaskChange(id, checked);
  };

  return (
    <div className='overflow-auto mt-3' style={{height: '300px'}}>
      {subTasks.map((task, index: number) => (
        <div key={task.id} className="d-flex gap-2 align-items-center mb-2">
          <InputCheckbox
            label={task.description}
            onChange={(e: any) => handleCheckboxChange(task.id, e.target.checked)}
            value={task.checked}
            key={index} 
          />
        </div>
      ))}
    </div>
  )};

const SelectTaskItem = () => {
  const [food, setFood] = React.useState('fruit');

  const handleFoodChange = (event: any) => {
    setFood(event.target.value);
  };

  return (
    <React.Fragment>
      <SelectFieldDefault 
        label=""
        options={[
          { label: 'Fruit', value: 'fruit' },
          { label: 'Vegetable', value: 'vegetable' },
          { label: 'Meat', value: 'meat' },
        ]}
        value={food}
        onChange={handleFoodChange}
        className=''
      />
    </React.Fragment>
  ) 
}

const BodyDefault = (props: { disabledForm?: boolean; listSubTasks?: any }) => {
  const [subTasks, setSubTasks] = useState<SubTask[]>(props.listSubTasks?.data || []);

  useEffect(() => {
    if (props.listSubTasks?.data) {
      setSubTasks(props.listSubTasks.data);
    }
  }, [props.listSubTasks]);

  const handleTaskChange = (id: number, checked: boolean) => {
    const updatedTasks = subTasks.map((task) =>
      task.id === id ? { ...task, checked } : task
    );
    setSubTasks(updatedTasks);
  };

  return (
    <div className="row mt-3 h-100 overflow-hidden p-4">
      <div className="col-md-6 overflow-hidden">
        <FormTextAreaDefault task_description="abacaxi" disabledForm={props.disabledForm} />
        <SubTasksWithCheckbox subTasks={subTasks} onTaskChange={handleTaskChange} />
        <div className="d-flex flex-column justify-content-end">
          <input type="text" className="form-control d-block" />
        </div>
      </div>
      <div className="col-md-6 h-100 border border-primary">
        <SelectTaskItem />
      </div>
    </div>
  );
};

  
const ModalDefault: React.FC<TaskItem> = (props) => {
  return (
    <div className='zIndex99'>
      <div className="card w-75 h-75 overflow-hidden position-absolute modal-card-default">
        <section className='header-modal-default'>
          <HeaderModal color='danger' description={props.taskFilter.description} OnClick={props.close_modal} />
          <ProgressBar progressValue={props.taskFilter.percent ? props.taskFilter.percent : '20'}/>
        </section>
        <section className='body-modal-default'>
          <BodyDefault listSubTasks={props.listItem || []} />
        </section>
      </div>
    </div>
  );
};


export default ModalDefault;
  
