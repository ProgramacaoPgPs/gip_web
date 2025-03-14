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

  return (
    <div className='d-flex justify-content-between flex-column w-100 h-100'>
      <div className='row'>
        <div className='col-12'>
        <div className='d-flex justify-content-start flex-wrap overflow-auto' style={{ maxHeight: '90vh', height: '100%' }}>
          {["","","","",""].map((item, index) => (
            <div key={`list_${index}`} className='col-12 col-sm-6 col-md-4 col-lg-3 rounded p-3 cardTest form-control bg-white bg-opacity-75 shadow m-2'>
              <div className='position-relative'>
                {data.isFavorite && (
                  <i className='fa fa-star text-warning' style={{ position: 'absolute', top: '0px', left: '200px', zIndex: 1 }} />
                )}
              </div>
              <div className='text-dark'>
                <div><strong>Nome:</strong> {data.name}</div>
                <div><strong>CEP:</strong> {data.zipCode}</div>
                {openList && (
                  <>
                    <div><strong>CNPJ:</strong> {data.cnpj}</div>
                    <div><strong>Estado:</strong> {data.state}</div>
                    <div><strong>Cidade:</strong> {data.city}</div>
                    <div><strong>Distrito:</strong> {data.district}</div>
                    <div><strong>Numero:</strong> {data.numberEstabelicity}</div>
                    <div><strong>Rua:</strong> {data.street}</div>
                    <div><strong>Complement:</strong> {data.complement}</div>
                  </>
                )}
              </div>
              <div className='d-flex justify-content-between'>
                <div className='d-flex gap-2 mt-2'>
                  <button className='btn colorSystem' onClick={onDelete} aria-label="Excluir">
                    <i className='fa fa-trash text-primaryColor' />
                  </button>
                  <button className='btn colorSystem' onClick={onEdit} aria-label="Editar">
                    <i className='fa fa-pen' />
                  </button>
                </div>
                <div>
                  <button className='btn btn-transparent' onClick={() => setOpenList(prev => !prev)}>
                    <i className={`fa-solid ${!openList ? 'fa-rotate-180' : ''} fa-chevron-up text-dark`}></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
