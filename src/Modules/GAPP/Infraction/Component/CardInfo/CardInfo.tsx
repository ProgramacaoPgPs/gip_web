import React, { useRef, useState } from 'react';
import { Connection } from '../../../../../Connection/Connection';
import ModalConfirm from '../../../../../Components/ModalConfirm';
import { ICardInfoProps, IFormData } from '../../Interfaces/IFormGender';
import '../style/style.css';
import { handleNotification } from '../../../../../Util/Util';
import { useMyContext } from '../../../../../Context/MainContext';

/**
 * @description O card é o ponto principal para trabalhar com a edição e o desativamento de um 
 * endereço cadastrado e também pode fazer a reciclagem desse endereço cadastrado ou seja ele pode 
 * recuperar essa informação para que ela não seja deletada
 */
const CardInfo: React.FC<ICardInfoProps> = ({
  setData,
  setHiddenForm,
  visibilityTrash,
  dataStore,
  dataStoreTrash,
  resetDataStore
}) => {
  const [confirm, setConfirm] = useState(false);
  const currentItemRef = useRef<IFormData | null>(null);
  const { loading, setLoading } = useMyContext();

  const handleUpdateStoreStatus = async (item: IFormData, status: number) => {
    try {
      setLoading(true);
      const payload = { ...item, status_store: status };
      const connection = new Connection("15");
      await connection.put(payload, "GAPP/Store.php");
      await resetDataStore?.();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      handleNotification("Erro", 'Erro no Serviço! ' + error, "danger");
    } finally {
      setLoading(false);
    }
  };

  function DataModalItem(item: IFormData, index: number) {
    const infoFields = [
      { label: "Nome", value: item?.name },
      { label: "CEP", value: item?.zip_code },
      { label: "CNPJ", value: item?.cnpj },
      { label: "Estado", value: item?.state },
      { label: "Cidade", value: item?.city },
      { label: "Distrito", value: item?.district },
      { label: "Número", value: item?.number },
      { label: "Rua", value: item?.street },
      { label: "Complemento", value: item?.complement },
    ];

    return (
      <div key={`list_${index}`} className={`col-12 col-sm-6 col-md-4 col-lg-3 rounded p-3 cardTest form-control bg-white bg-opacity-75 shadow m-2`}>
        {infoFields.map((field, index) => (
          <div className='text-dark text-card' key={index}>
            <strong title={field.value}>{field.label}:</strong> {field.value}
          </div>
        ))}
        <div className='d-flex justify-content-between'>
          <div className='d-flex gap-2 mt-2'>
            {item.status_store === 0 && (
              <button
                className='btn colorSystem'
                onClick={() => {
                  currentItemRef.current = item;
                  handleUpdateStoreStatus(currentItemRef.current, 1);
                }}
                disabled={loading}
                aria-label="Recycle"
              >
                <i className='fa fa-repeat text-primaryColor' />
              </button>
            )}
            {item.status_store === 1 && (
              <React.Fragment>
                <button
                  className='btn colorSystem'
                  onClick={() => {
                    currentItemRef.current = item;
                    setConfirm(true);
                  }}
                  aria-label="Excluir"
                >
                  <i className='fa-solid fa-trash-can-arrow-up text-primaryColor' />
                </button>
                <button
                  className='btn colorSystem'
                  onClick={() => {
                    setHiddenForm((prev: boolean) => !prev);
                    setData({ ...item });
                  }}
                  aria-label="Editar"
                >
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
      {confirm && (
        <ModalConfirm
          cancel={() => setConfirm(false)}
          confirm={() => {
            const currentItem = currentItemRef.current;
            if (!currentItem) return;

            const newStatus = currentItem.status_store === 1 ? 0 : 1;
            handleUpdateStoreStatus(currentItem, newStatus);
            handleNotification("Sucesso", "Item inativado com sucesso", "success");
            setConfirm(false);
          }}
        />
      )}
      <div className={`row h-25`}>
        <div className='col-12'>
          <div className='d-flex justify-content-start flex-wrap overflow-auto h-100 heightlite_screen'>
            {(visibilityTrash ? dataStore : dataStoreTrash)?.length > 0
              ? (visibilityTrash ? dataStore : dataStoreTrash).slice().reverse().map((item: IFormData, index: number) => DataModalItem(item, index))
              : (
                <div className="p-3 m-auto shadow-sm border_none background_whiteGray" role="alert">
                  <b className="text-muted font_size">
                    Não há dados {!visibilityTrash ? 'na lixeira' : 'para visualizar'}
                  </b>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
