import React, { useState, useEffect } from 'react';
import "./style.css";
import { Connection } from '../../../../Connection/Connection';
import { InputCheckbox, SelectField, SelectFieldDefault } from '../../../../Components/CustomForm';
import AvatarGroup from '../Avatar/avatar';
import CheckboxList from '../CheckboxList/checkboxlist';

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
  check: boolean;
  task_id: number;
}

type SubTasksWithCheckboxProps = {
  subTasks: SubTask[];
  onTaskChange: (id: number, checked: boolean) => void;
}

const connection = new Connection("18", true);
  
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
    <textarea style={{resize: 'none'}} onChange={handleTextChange} disabled={disabledForm || !isOpenButton} value={value} className={textAreaClasses} cols={cols} rows={rows} />
    <button onClick={() => setIsOpenButton((prev: boolean) => !prev)} className={`${buttonClasses} btn-${isOpenButton ? 'success' : 'danger'}`}>
      {isOpenButton ? buttonTextOpen : buttonTextClosed}
    </button>
  </div>
);
};


const SubTasksWithCheckbox: React.FC<SubTasksWithCheckboxProps> = ({ subTasks, onTaskChange }) => {
  const handleCheckboxChange = async (id: number, checked: boolean, idTask: any ) => {
    onTaskChange(id, checked);

    let result = await connection.put({
      check: checked, 
      id: id,
      task_id: idTask
    }, "GTPP/TaskItem.php");
    console.log(result);
  };

  return (
    <div className='overflow-auto mt-3' style={{height: '300px'}}>
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

  
  const SelectTaskItem = (props: { data?: any }) => {
    const [shopValue, setShop] = useState<any>();
    const [CompanyValue, setCompany] = useState<any>([]);
    const [DepartamentValue, setDepartament] = useState<any>();

    const [CompanyData, setCompanyData] = useState<any>(props.data.csds[0]?.company_id);
    const [ShopData, setShopData] = useState<any>(props.data.csds[0]?.shop_id);
    const [DepartamentData, setDepartamentData] = useState<any>(props.data.csds[0]?.departament_id);

    const [openModal, setOpenModal] = useState<any>(false);
  
    useEffect(() => {
      async function department() {
        //task_id=4286
        const result1 = await connection.get(`&company_id=1&shop_id=1&task_id=${props.data?.id}`, "CCPP/Department.php");
        const result2 = await connection.get("&company_id=1", "CCPP/Shop.php");
        const result3 = await connection.get("", "CCPP/Company.php");
  
        setDepartament(result1);
        setCompany(result3);
        setShop(result2);
      }
  
      department();
    }, []);

    console.log(DepartamentValue, shopValue, CompanyValue);

    // Verifica se há dados disponíveis
    const hasData = CompanyValue?.data?.length && shopValue?.data?.length && DepartamentValue?.data?.length;
  
    return (
      <React.Fragment>
        <div className='d-flex align-items-centers justify-content-around mt-2 position-relative'>
          {hasData ? (
            <React.Fragment>
              <SelectFieldDefault
                label='Compania'
                value={CompanyData}
                onChange={(e: any) => {setCompanyData(e.target.value)}}
                options={CompanyValue.data?.map((item: any) => ({ label: item.description, value: item.id }))}
              />
  
              <SelectFieldDefault
                label='Loja'
                value={ShopData}
                onChange={(e: any) => setShopData(e.target.value)}
                options={shopValue.data?.map((item: any) => ({ label: item.description, value: item.id }))}
              />
  
              {/* <SelectFieldDefault
                label='Departamento'
                value={DepartamentData}
                onChange={(e: any) => setDepartamentData(e.target.value)}
                options={DepartamentValue.data?.map((item: any) => ({ label: item.description, value: item.id }))}
              /> */}

              <div className='d-flex align-items-center mt-4 position-relative' id={'idTeste'}>
                <div><button className='btn btn-light border' onClick={() => setOpenModal((prev:boolean) => !prev)} style={{height: '40px'}} >Departamento</button></div>
                <div className='position-absolute' style={{top: '104%'}}>
                  {openModal && <CheckboxList items={DepartamentValue.data} />}
                </div>
              </div>
            </React.Fragment>
          ) : (
            <p>Carregando dados...</p>
          )}
        </div>
      </React.Fragment>
    );
  };
  

const BodyDefault = (props: { disabledForm?: boolean; listSubTasks?: any, taskListFiltered: any }) => {
  const [subTasks, setSubTasks] = useState<SubTask[]>(props.listSubTasks?.data || []);

  useEffect(() => {
    if (props.listSubTasks?.data) {
      setSubTasks(props.listSubTasks.data);
    }
  }, [props.listSubTasks]);

  const handleTaskChange = (id: number, check: boolean) => {
    const updatedTasks = subTasks.map((task) =>
      task.id === id ? { ...task, check } : task
    );
    setSubTasks(updatedTasks);
  };

  const users = [
    { name: "Alice", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFG1m8cHJEfi8AM6vWVYJZaRXfcWcLIQZGiw&s", online: true },
    { name: "Bob", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFG1m8cHJEfi8AM6vWVYJZaRXfcWcLIQZGiw&s", online: false },
    { name: "Charlie", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFG1m8cHJEfi8AM6vWVYJZaRXfcWcLIQZGiw&s", online: false },
    { name: "David", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFG1m8cHJEfi8AM6vWVYJZaRXfcWcLIQZGiw&s", online: false },
    { name: "Eve", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFG1m8cHJEfi8AM6vWVYJZaRXfcWcLIQZGiw&s", online: true }
  ];


  return (
    <div className="row mt-3 h-100 overflow-hidden p-4">
      <div className="col-md-6 overflow-hidden">
        <FormTextAreaDefault task_description="abacaxi" disabledForm={props.disabledForm} />
        <SubTasksWithCheckbox subTasks={subTasks} onTaskChange={handleTaskChange} />
        <div className="d-flex justify-content-between gap-3 pt-3 pb-2">
          <div className='w-100'>
            <input type="text" className="form-control d-block" />
          </div>
          <div>
            <button onClick={(e:any) => console.log('Olá mundo!')} className='btn btn-success'>Enviar</button>
          </div>
        </div>
      </div>
      <div className="col-md-6 h-100 position-relative">
        <SelectTaskItem data={props.taskListFiltered} />
        <div className='position-absolute position-box-users'>
          <AvatarGroup dataTask={props.taskListFiltered} users={users} />
        </div>
      </div>
    </div>
  );
};

  
const ModalDefault: React.FC<TaskItem> = (props) => {
  console.log(props);
  return (
    <div className='zIndex99'>
      <div className="card w-75 overflow-hidden position-absolute modal-card-default">
        <section className='header-modal-default'>
          <HeaderModal color='danger' description={props.taskFilter.description} OnClick={props.close_modal} />
          <ProgressBar progressValue={props.taskFilter.percent ? props.taskFilter.percent : '20'} />
        </section>
        <section className='body-modal-default'>
          <BodyDefault taskListFiltered={props.taskFilter} listSubTasks={props.listItem || []} />
        </section>
      </div>
    </div>
  );
};


export default ModalDefault;
  
