import React, { useState } from 'react';
import { Connection } from '../../../../Connection/Connection';
import ModalConfirm from '../../../../Components/ModalConfirm';
import useWindowSize from '../../hook/useWindowSize';
import { ICardInfoProps } from '../../Interfaces/IFormGender';
import '../style/style.css';


/**
 * @description O card é o ponto principal para trabalhar com a edição e o desativamento de um endereço cadastrado e também pode fazer a reciclagem desse endereço cadastrado ou seja ele pode recupear essa informação para que ela não seja deletada
 */
const CardInfo: React.FC<ICardInfoProps> = ({ setData, setHiddenForm, visibilityTrash, dataStore, dataStoreTrash, resetDataStore }) => {
  const [confirm, setConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToRicycle, setItemToRicycle] = useState(null);
  const {isMobile} = useWindowSize();

  const handleUpdateStatusStore = async (item: []) => {
    try {
      const connection = new Connection("15");
      await connection.put({ ...item, status_store: 0 }, "GAPP/Store.php");
      setConfirm(false);
      resetDataStore?.();
    } catch (error) {
      alert('Erro no Serviço!'+error);
    }
  };

  const handleRecycle = async (item: []) => {
    try {
      const connection = new Connection("15");
      await connection.put({ ...item, status_store: 1 }, "GAPP/Store.php");
      setConfirm(false);
      resetDataStore?.();
    } catch (error) {
      alert('Erro no Serviço!'+error);
    }
  };
  
  function dataModalItem(item: any, index: number) {
    return (
      <div key={`list_${index}`} className={`col-12 col-sm-6 col-md-4 col-lg-3 rounded p-3 cardTest form-control bg-white bg-opacity-75 shadow m-2`}>
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
            {item.status_store == 0 && (
              <React.Fragment>
                <button className='btn colorSystem' onClick={() => {
                  setItemToRicycle(item);
                  setConfirm(true);
                }} aria-label="Recycle">    
                  <i className='fa fa-repeat text-primaryColor' />
                </button>
              </React.Fragment>
            )}
            {item.status_store == 1 && (
              <React.Fragment>
                <button className='btn colorSystem' onClick={() => {
                  setItemToDelete(item);
                  setConfirm(true);
                }} aria-label="Excluir">
                  <i className='fa-solid fa-trash-can-arrow-up text-primaryColor' />
                </button> 
                <button className='btn colorSystem' onClick={() => {
                  setHiddenForm((prev: boolean) => !prev);
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
  }

  return (
    <div className='d-flex justify-content-between flex-column w-100 border_gray rounded'>
      {confirm && 
        <ModalConfirm 
          cancel={() => setConfirm(false)}
          confirm={() => {
            if (itemToDelete) {
              handleUpdateStatusStore(itemToDelete);
            }
            if (itemToRicycle) {
              handleRecycle(itemToRicycle);
            }
          }}/>}
      <div className={`row h-25`}>
        <div className='col-12'>
          <div className='d-flex justify-content-start flex-wrap overflow-auto h-100 heightlite_screen'>
            {(visibilityTrash ? dataStore : dataStoreTrash)?.length > 0
              ? (visibilityTrash ? dataStore : dataStoreTrash)?.map((item: any, index: any) => dataModalItem(item, index))
              : <div 
              className="p-3 m-auto shadow-sm border_none background_whiteGray"
              role="alert"
            ><b className="text-muted font_size">Não há dados {!visibilityTrash ? 'na lixeira' : 'para visualizar' }</b></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
