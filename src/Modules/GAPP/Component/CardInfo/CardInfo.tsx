import React, { useEffect, useState } from 'react';
import { Connection } from '../../../../Connection/Connection';
import ModalConfirm from '../../../../Components/ModalConfirm';
import '../style/style.css';

interface ICardInfoProps {
  setData?: any;
  setHiddenForm?: any;
  visibilityTrash?: any;
}

const CardInfo: React.FC<ICardInfoProps> = ({ setData, setHiddenForm, visibilityTrash }) => {
  const [confirm, setConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [dataStore, setDataStore] = useState<any>([]);
  const [dataStoreTrash, setDataStoreTrash] = useState<any>([]);

  const handleDelete = async (item: any) => {
    const connection = new Connection("15");
    await connection.put({ ...item, status_store: 0 }, "GAPP/Store.php");
    setConfirm(false);
    resetDataStore();
  };

  const connectionBusiness = async () => {
    const response = await new Connection("18");
    let data: any = await response.get('&status_store=1', 'GAPP/Store.php');
    setDataStore(data.data);
  };
  
  const connectionBusinessTrash = async () => {
    const response = await new Connection("18");
    let data: any = await response.get('&status_store=0', 'GAPP/Store.php');
    setDataStoreTrash(data.data);
  };

  useEffect(() => {
    connectionBusiness();
    connectionBusinessTrash();
  }, []);

  const resetDataStore = () => {
    setDataStore([]);
    connectionBusiness();

    setDataStoreTrash([]);
    connectionBusinessTrash();
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
            {item["status_store"] == 1 && (
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
  }

  return (
    <div className='d-flex justify-content-between flex-column w-100 h-100'>
      {confirm && 
        <ModalConfirm 
          cancel={() => setConfirm(false)}
          confirm={() => {
            if (itemToDelete) {
              handleDelete(itemToDelete);
            }
          }}/>}
      <div className='row'>
        <div className='col-12'>
          <div className='d-flex justify-content-start flex-wrap overflow-auto' style={{ maxHeight: '90vh', flex: 'auto' }}>
            {(visibilityTrash ? dataStore : dataStoreTrash)?.length > 0
              ? (visibilityTrash ? dataStore : dataStoreTrash)?.map((item: any, index: any) => dataModalItem(item, index))
              : <div className="alert alert-danger m-auto" role="alert">Erro: Dados não encontrados.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
