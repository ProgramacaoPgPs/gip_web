import React, { useCallback } from 'react';
import CustomForm from '../../../../Components/CustomForm';
import { fildsetsFormsBusiness } from '../../mock/configuration';
import { handleNotification } from '../../../../Util/Util';
import { useSendData } from '../../hook/useSendData';

// Lista de estados pode ser movida para um arquivo de configuração
interface IFormProps {
  data?: any;
  handleFunction?: any;
  errorCep?: any;
  resetDataStore?: any;
  resetForm?: any;
}

const Form: React.FC<IFormProps> = ({ data, handleFunction, errorCep, resetDataStore, resetForm }) => {
  const [handleFildCNPJ, handleFieldName, handleFieldStreet, handleFieldDistrict, handleFieldCity, handleFieldState, handleFieldNumber, handleFieldZipCode, handleFieldComplement] = handleFunction;
  const isNewStore = !data.id;

  const { sendData, loading } = useSendData(handleNotification);
  const filter = fildsetsFormsBusiness(
    handleFildCNPJ, 
    handleFieldName, 
    handleFieldStreet,
    handleFieldDistrict, 
    handleFieldCity, 
    handleFieldState, 
    handleFieldNumber, 
    handleFieldZipCode, 
    handleFieldComplement,
    data,
  );

  function validateData(data: any) {
    return data.cnpj && data.name && data.street && data.district &&
         data.city && data.state && data.number && data.zip_code;
  }

  const handleSubmit = () => {
    if(!validateData(data)) return handleNotification("Error", "Prencha os campos antes de enviar", "danger");

    sendData(isNewStore ? 'POST' : 'PUT', 'GAPP/Store.php', {
      cnpj: data.cnpj.replace(/[^a-z0-9]/gi, ""),
      name: data.name,
      street: data.street,
      district: data.district,	
      city: data.city,
      state: data.state,
      number: data.number,
      zip_code: data.zip_code,
      complement: data.complement,
      status_store: data.store_visible,
      ...(isNewStore ? {} : { id: data.id }),
    }, resetDataStore);

    resetForm();
  };

  return (
    <React.Fragment>
      <div className='col-12 form-control bg-white bg-opacity-75 shadow m-2 w-100 d-flex flex-column justify-content-between'>
        <CustomForm
          classRender='col-4 w-100 flex-wrap'
          classButton='btn btn-success'
          className='p-3'
          notButton={false}
          fieldsets={filter}
        />
        <div className='row'>
          <div className="d-flex justify-content-center p-2">
            <button className={`btn btn-success w-100`} onClick={handleSubmit} disabled={loading}>
              <i className={`fa-sharp fa-solid ${isNewStore ? 'fa-paper-plane' : 'fa-arrows-rotate'} text-white`}></i>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Form;
