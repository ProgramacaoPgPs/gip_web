import React, { useCallback } from 'react';
import CustomForm from '../../../../Components/CustomForm';
import { fildsetsFormsBusiness } from '../../mock/configuration';
import { handleNotification } from '../../../../Util/Util';
import { useSendData } from '../../hook/useSendData';

// Lista de estados pode ser movida para um arquivo de configuração
const states = [
  { value: 'AC', label: 'AC' },
  { value: 'AL', label: 'AL' },
  { value: 'AP', label: 'AP' },
  { value: 'AM', label: 'AM' },
  { value: 'BA', label: 'BA' },
  { value: 'CE', label: 'CE' },
  { value: 'DF', label: 'DF' },
  { value: 'ES', label: 'ES' },
  { value: 'GO', label: 'GO' },
  { value: 'MA', label: 'MA' },
  { value: 'MT', label: 'MT' },
  { value: 'MS', label: 'MS' },
  { value: 'MG', label: 'MG' },
  { value: 'PA', label: 'PA' },
  { value: 'PB', label: 'PB' },
  { value: 'PR', label: 'PR' },
  { value: 'PE', label: 'PE' },
  { value: 'PI', label: 'PI' },
  { value: 'RJ', label: 'RJ' },
  { value: 'RN', label: 'RN' },
  { value: 'RS', label: 'RS' },
  { value: 'RO', label: 'RO' },
  { value: 'RR', label: 'RR' },
  { value: 'SC', label: 'SC' },
  { value: 'SP', label: 'SP' },
  { value: 'SE', label: 'SE' },
  { value: 'TO', label: 'TO' },
];

interface IFormProps {
  data: any;
  handleFunction: any;
  errorCep: any;
  resetDataStore: any;
}

const Form: React.FC<IFormProps> = ({ data, handleFunction, errorCep, resetDataStore }) => {
  const [handleFildCNPJ, handleFieldName, handleFieldStreet, handleFieldDistrict, handleFieldCity, handleFieldState, handleFieldNumber, handleFieldZipCode, handleFieldComplement] = handleFunction;

  // Função para determinar se o formulário é de criação ou atualização
  const isNewStore = !data.id;

  // Usando o hook useSendData
  // @ts-ignore
  const { sendData, loading, error, response } = useSendData(handleNotification);

  // Configuração dos campos do formulário
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
    //@ts-ignore
    states,
    data,
    errorCep,
    handleNotification,
  );

  const handleSubmit = () => {
    // Aqui chamamos sendData e passamos os parâmetros
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
      store_visible: data.store_visible,
      ...(isNewStore ? {} : { id: data.id }),
    }, resetDataStore);
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
            <button
              className={`btn btn-success w-100`}
              onClick={handleSubmit}
              disabled={loading}
            >
              <i className={`fa-sharp fa-solid ${isNewStore ? 'fa-paper-plane' : 'fa-arrows-rotate'} text-white`}></i>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Form;
