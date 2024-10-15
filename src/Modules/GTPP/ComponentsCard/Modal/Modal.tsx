import React, { useState } from 'react';
import "./style.css";

type TaskItem = {
    task?: any;
    setModalPage?: any;
    cardTaskItem?: {
        data?: Array<{ 
            description?: string,
            check?: boolean,
        }>;
    };
    Item: any
}

const ModalDefault: React.FC<TaskItem> = (props) => {
    let image = "https://images.pexels.com/photos/27495515/pexels-photo-27495515/free-photo-of-panorama-vista-paisagem-natureza.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    const [openTextArea, setOpenTextArea] = useState<any>(false);

    console.log(props.cardTaskItem);

    return (
      <div className='zIndex99'>
        <div className="card w-75 h-75 position-absolute modal-card-default">
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: false ? '' : "50%" }}
              aria-valuenow={50}  
              aria-valuemin={0}   
              aria-valuemax={100} 
              >
              {false ? '' : '50%'}
            </div>
          </div>
        <div className="col-12 bg-gray header-menu d-flex justify-content-between">
          <div className="w-100 d-flex align-items-center gap-3 px-1">
            <h1>
              <span className="fw-bold fs-2">{props.task?.description || 'Descrição indisponível'}</span>
            </h1>
          </div>
          <div>
            <button
              className="btn btn-danger text-light fa fa-x m-4"
              onClick={props.setModalPage}
            ></button>
          </div>
        </div>
        <div className="d-flex overflow-hidden h-100">
          <div className="col-7 h-100 p-2">
            <div className='h-100 p-2 overflow-auto'>
              <div className='d-flex flex-column align-items-end'>
                <textarea className='form-control' disabled={openTextArea}></textarea>
                <button onClick={() => setOpenTextArea((prev:any) => !prev)} className={`btn ${openTextArea ? 'btn-success' : 'btn-danger'} mt-2`}>Editar</button>
              </div>
              <div>
                {props.Item?.data ? (
                  props.Item.data.map((taskItem:any, index:any) => (
                    <div key={index} {...props}>
                      <div className="d-flex gap-2">
                          <div><input type="checkbox" checked={taskItem.check} /></div>
                          <div>{taskItem.description}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Sem dados disponíveis</p>
                )}
              </div>
              <div className='overflow-auto mt-2 '></div>
            </div>
          </div>
          <div className="col-5 border border-primary h-100 overflow-hidden d-flex flex-column justify-content-between">
            {/*
              - Fazer um componente de datas []
              - Fazer um componente de barra de progresso []
              - Fazer selecionadores de loja e companhias []
              - Fazer fazer um botão para parar a tarefa []
              - Fazer um formulário de adicionar um item (ou seja uma tarefa!) e uma imagem []
              - Mostrar todos os colaboradores []
            */}
            <div>
              <div className='px-3 pt-2 d-flex justify-content-between '>
                  <div>
                    <span>Selecione a Compania</span>
                    <select className='form-select'>
                      <option value="">teste</option>
                    </select>
                  </div>
                  <div>
                    <span>Selecione a loja</span>
                    <select className='form-select'>
                      <option value="">teste</option>
                    </select>
                  </div>
                  <div>
                    <span>Selecione o departamento</span>
                    <select className='form-select'>
                      <option value="">teste</option>
                    </select>
                  </div>
              </div>
              <div className='px-3 mt-3 d-flex gap-4'>
                <div>
                  <span>Data inicial:</span>
                  <input type="date" className='form-control' disabled value={'2001-06-03'} />
                </div>
                <div>
                  <span>Data Final:</span>
                  <input type="date" className='form-control' value={'2001-06-03'} />
                </div>
                <div>
                  <span>Status da Tarefa:</span>
                  <button type="button" className={`d-block btn ${true ? 'btn-danger' : 'btn-primary'}`}>Parado</button>
                </div>
              </div>
              <div className='px-3 mt-3 d-flex gap-4'>
                
              </div>
            </div>
            <div className='px-3 mt-3'>
              <div>
                {/* Aqui vou tratar os usúarios */}
                <React.Fragment>
                  <div>
                    <h2>Usuários conectados</h2>
                    <div className='d-flex gap-2 position-relative mt-2' onClick={() => console.log('vendo quantas pessoas vinculadas a tarefa!')}>
                    {props.Item ? props.Item?.data?.map((item:any) => {
                      return (
                        <React.Fragment>
                          <img alt="item.name" className="cursor-pointer rounded-circle mb-3 border-online" height={50} width={50} src={image}  />
                        </React.Fragment>
                      )
                    }) : (
                      <h2>Não há colaboradores para essa tarefa</h2>
                    )}
                    </div>
                  </div>
                </React.Fragment>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  };
  
  export default ModalDefault;
  
