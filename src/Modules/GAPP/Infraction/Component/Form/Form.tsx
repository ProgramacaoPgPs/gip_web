import React from 'react';
import CustomForm from '../../../../../Components/CustomForm';
import { handleNotification } from '../../../../../Util/Util';
import { Connection } from '../../../../../Connection/Connection';
import { useMyContext } from '../../../../../Context/MainContext';
import { fieldsetsFormsInfractions } from '../../mock/configuration';

const Form: React.FC<any> = ({data, handleFunction, resetDataStore, resetForm }) => {
  const defaultFunction = () => {};
  const { setLoading } = useMyContext();

  const [
    handleInfraction = defaultFunction,
    handleGravitity = defaultFunction,
    handlePoints = defaultFunction
  ] = handleFunction || [];

  const isNewStore = !data?.infraction_id;
  async function postStore(obj: any, conn:any = new Connection('18')) {
    try {
      setLoading(true);
      const response = await conn.post(obj, 'GAPP/Infraction.php');

      !response.error ?
        handleNotification("Sucesso", "Infração salva com sucesso!", "success") :
        handleNotification("Erro", "Não foi possivel salvar a infração!", "danger");

      return response.error;
    } catch (error) {
      handleNotification("Erro", `${error}`, "danger");
    } finally {
      setLoading(false);
    }
  }

  async function putStore(obj:any, conn: any = new Connection('18')) {
    try {
      setLoading(true);
      const response = await conn.put(obj, 'GAPP/Infraction.php');
      !response.error ?
            handleNotification("Sucesso", "Infração atualizada com sucesso!", "success") :
            handleNotification("Erro", "Infração não foi possivel ser atualizada!", "danger");
      return response.error;
    } catch (error) {
      handleNotification("Erro", `${error}`, "danger");
    } finally {
      setLoading(false);
    }
  }

  const editorSendData = async () => {
    try {
      let result;
      if(isNewStore) {
        result = await postStore(formatStoreData(data));
      } else {
        result = await putStore(formatStoreData(data));
      }
      if(!result) {
        if(resetDataStore) resetDataStore();
        if(resetForm) resetForm();
      }
    } catch (error) {
      handleNotification("Error", String(error).toLowerCase(), "danger");
    }
  };

  function formatStoreData (data: any) {
    return {
      infraction: data?.infraction,
      points: data?.points,
      gravitity: data?.gravitity,
      status_infractions: 1,
      ...(isNewStore ? {} : { infraction_id: data.infraction_id }),
    };
  };

  return (
    <React.Fragment>
      <div className='col-12 form-control bg-white bg-opacity-75 shadow m-2 w-100 d-flex flex-column justify-content-between form-style-modal'>
        <CustomForm classRender='w-100' classButton='btn btn-success' className='p-3' notButton={false}
          fieldsets={fieldsetsFormsInfractions(handleInfraction,  handlePoints,  handleGravitity,  data)} />
        <div className='row'>
          <div className="d-flex justify-content-center p-2">
            <button className={`btn btn-success w-100`} onClick={editorSendData}>
              <i className={`fa-sharp fa-solid ${isNewStore ? 'fa-paper-plane' : 'fa-arrows-rotate'} text-white`}></i>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Form;
