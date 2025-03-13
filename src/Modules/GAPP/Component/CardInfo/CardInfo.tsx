import '../style/style.css'
import React, { useState } from 'react';

interface ICardInfoProps {
  data: {
    cnpj: string;
    name: string;
    street: string;
    district: string;
    city: string;
    state: string;
    numberEstabelicity: string;
    zipCode: string;
    complement: string;
    isFavorite: any;
  };
  
  onEdit: () => void;
  onDelete: () => void;
}

const CardInfo: React.FC<ICardInfoProps> = ({ data, onEdit, onDelete }) => {
  const [openList, setOpenList] = useState<boolean>(false);

  console.log(data);

  return (
    <div className='d-flex position-relative flex-column justify-content-between h-75'>
      <div className='p-3 text-white d-flex align-item-center justify-content-center'>  
        <div className='h-100 h-sm-25 w-100 d-flex flex-wrap gap-3 overflow-auto'>
        {[0].map(item => (
          <div className='rounded p-3 cardTest'>
            <div className='position-relative'>{
              data.isFavorite && (
                <i className='fa fa-star text-dark' style={{ position: 'absolute', top: '0px', left: '250px', zIndex: 1 }} />
              )}
            </div>
            <div className='text-white'>
              <div><strong>Nome:</strong> {data.name}</div>
              <div><strong>CEP:</strong> {data.zipCode}</div>
              {openList && (
                <React.Fragment>
                  <div><strong>CNPJ:</strong> {data.cnpj}</div>
                  <div><strong>Estado:</strong> {data.state}</div>
                  <div><strong>Cidade:</strong> {data.city}</div>
                  <div><strong>Distrito:</strong> {data.district}</div>
                  <div><strong>Numero:</strong> {data.numberEstabelicity}</div>
                  <div><strong>Rua:</strong> {data.street}</div>
                  <div><strong>Complement:</strong> {data.complement}</div>
                </React.Fragment>
              )}
            </div>
            <div className='d-flex justify-content-between'>
              <div className='d-flex gap-2 mt-2'>
                <button className='btn btn-dark' onClick={onDelete} aria-label="Excluir">
                  <i className='fa fa-trash text-white' />
                </button>
                <button className='btn btn-dark' onClick={onEdit} aria-label="Editar">
                  <i className='fa fa-pen text-white' />
                </button>
              </div>
              <div>
                
                <button className='btn btn-transparent' onClick={() => {
                  setOpenList((prev:boolean) => !prev)
                }}>
                    <i className={`fa-solid ${!openList ? 'fa-rotate-180' : ''} fa-chevron-up text-dark`}></i>
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
      <div className='d-flex justify-content-center'>
        {true ? (
            <button className='btn btn-success' onClick={() => console.log('Salvar informações')}>
                <i className="fa-sharp fa-solid fa-paper-plane text-white"></i>
            </button>
        ) : (
            <button className='btn btn-warning' onClick={() => console.log('Atualizar informações')}>
                <i className="fa-solid fa-arrows-rotate text-white"></i>
            </button>
        )}
      </div>
    </div>
  );
};

export default CardInfo;
