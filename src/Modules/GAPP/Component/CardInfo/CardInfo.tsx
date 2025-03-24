import React, { useState } from 'react';
import { Connection } from '../../../../Connection/Connection';
import ModalConfirm from '../../../../Components/ModalConfirm';
import useWindowSize from '../../hook/useWindowSize';
import '../style/style.css'

interface ICardInfoProps {
  dataStore: any;
  data?: any;
  setData: any;
  onDelete?: () => void;
  setHiddenForm: any;
  visibilityTrash: any;
  resetDataStore?: any;
}

const CardInfo: React.FC<ICardInfoProps> = ({ setData, dataStore, setHiddenForm, visibilityTrash, resetDataStore }) => {
  const [confirm, setConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const {isMobile} = useWindowSize();

  const handleDelete = async (item: any) => {
    const connection = new Connection("15");
    await connection.put({ ...item, store_visible: 0 }, "GAPP/Store.php");
    setConfirm(false);
    resetDataStore();
  };

  if(dataStore.length > 0) {
    return (
      <div className='d-flex justify-content-between flex-column w-100 h-100'>
        {confirm && 
          <ModalConfirm 
            cancel={() => setConfirm(false)}
            confirm={() => {
              if (itemToDelete) {
                handleDelete(itemToDelete);
              }
            }}
          />
        }
        <div className='row'>
          <div className='col-12'>
            <div className='d-flex justify-content-start flex-wrap overflow-auto' style={{ maxHeight: '90vh', flex: 'auto'}}>
              {dataStore?.length < 0 ? (
                <div className="alert alert-warning m-auto mt-5" role="alert">
                  Não há dados para mostrar!
                </div>
              ) : (
                dataStore.filter((item: any) => item["store_visible"] == visibilityTrash ).map((item: any, index: any) => {
                  return (
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
                          {item["store_visible"] == 1 && (
                            <React.Fragment>
                              <button className='btn colorSystem' onClick={() => {
                                setItemToDelete(item);
                                setConfirm(true);
                              }} aria-label="Excluir">
                                <i className='fa fa-trash text-primaryColor' />
                              </button> 
                              <button className='btn colorSystem' onClick={() => {
                                setHiddenForm((prev: any) => !prev);
                                setData({ ...item });
                              }} aria-label="Editar">
                                <i className='fa fa-pen' />
                              </button>
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <React.Fragment>
        {!isMobile ? (
          <div className='alert alert-danger position-absolute' style={{left: '50%', right: '50%', top: '40%', width: '250px'}}>
          Não há dados para mostrar
          </div>
        ) : (
          <div>Não há dados para mostrar</div>
        )}
      </React.Fragment>
    );
  }
};

export default CardInfo;
