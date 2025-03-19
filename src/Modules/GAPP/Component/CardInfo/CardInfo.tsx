import '../style/style.css'
import React from 'react';

interface ICardInfoProps {
  dataStore: any;
  data: any;
  setData: any;
  onDelete: () => void;
}

const CardInfo: React.FC<ICardInfoProps> = ({ data, onDelete, setData, dataStore }) => {
  return (
    <div className='d-flex justify-content-between flex-column w-100 h-100'>
      <div className='row'>
        <div className='col-12'>
          <div className='d-flex justify-content-start flex-wrap overflow-auto' style={{ maxHeight: '90vh', flex: 'auto'}}>
            {dataStore?.length < 0 ? (
              <div className="alert alert-warning m-auto mt-5" role="alert">
                Não há dados para mostrar!
              </div>
            ) : (
              dataStore?.map((item: any, index: any) => (
                <div key={`list_${index}`} className={`col-12 col-sm-6 col-md-4 col-lg-3 rounded p-3 cardTest form-control bg-white bg-opacity-75 shadow m-2 `}>
                  <div className='text-dark'>
                    <div><strong>Nome:</strong> {item.name}</div>
                    <div><strong>CEP:</strong> {item.zip_code}</div>
                    <div><strong>CNPJ:</strong> {item.cnpj}</div>
                    <div><strong>Estado:</strong> {item.state}</div>
                    <div><strong>Cidade:</strong> {item.city}</div>
                    <div><strong>Distrito:</strong> {item.district}</div>
                    <div><strong>Numero:</strong> {item.number}</div>
                    <div><strong>Rua:</strong> {item.street}</div>
                    <div><strong>Complement:</strong> {item.complement}</div>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <div className='d-flex gap-2 mt-2'>
                      <button className='btn colorSystem' onClick={onDelete} aria-label="Excluir">
                        <i className='fa fa-trash text-primaryColor' />
                      </button>
                      <button className='btn colorSystem' onClick={() => {
                        setData({...item})}} 
                        aria-label="Editar">
                        <i className='fa fa-pen' />
                      </button>
                    </div>
                    <div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
