import React from 'react';
import CustomForm from '../../../../Components/CustomForm';
import { fildsetsFormsBusiness } from '../../mock/configuration';
import { handleNotification } from '../../../../Util/Util';
import { Connection } from '../../../../Connection/Connection';
import { IFormData, IFormProps } from '../../Interfaces/IFormGender';


/**
 * @description Este é um formulário dinâmico gerado a partir de um objeto JSON. Ele permite adicionar novos campos de forma simples, bastando alterar o arquivo de configuração.
 * 
 * O arquivo de configuração onde os campos podem ser modificados ou adicionados encontra-se em: 
 * @path ./mock/configuration.ts.
 * 
 * Ao atualizar esse arquivo, o formulário será automaticamente atualizado com os novos campos definidos no JSON.
 * 
 * Isso proporciona flexibilidade e escalabilidade para a criação de formulários sem a necessidade de modificar diretamente o código-fonte do componente.
 * 
 * e com isso voce tem que configurar o arquivo por aqui seguindo as referencias do projeto.
 */
const Form: React.FC<IFormProps> = ({ data, handleFunction, resetDataStore, resetForm }) => {

  const defaultFunction = (value: string) => {};

  const [
    handleFildCNPJ = defaultFunction,
    handleFieldName = defaultFunction,
    handleFieldStreet = defaultFunction,
    handleFieldDistrict = defaultFunction,
    handleFieldCity = defaultFunction,
    handleFieldState = defaultFunction,
    handleFieldNumber = defaultFunction,
    handleFieldZipCode = defaultFunction,
    handleFieldComplement = defaultFunction
  ] = handleFunction || [];

  const isNewStore = !data?.id;

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

  function validateData(data: IFormData | undefined) {
    return data?.name && data?.street && data?.district &&
         data?.city && data?.state && data?.number && data?.zip_code;
  }

  const handleSubmit2 = async () => {
    if(!validateData(data)) return handleNotification("Error", "Prencha os campos antes de enviar", "danger");
    const conn = new Connection('18');
    let obj = {
      cnpj: data?.cnpj.replace(/[^a-z0-9]/gi, ""),
      name: data?.name,
      street: data?.street,
      district: data?.district,	
      city: data?.city,
      state: data?.state,
      number: data?.number,
      zip_code: data?.zip_code,
      complement: data?.complement,
      status_store: data?.store_visible,
      ...(isNewStore ? {} : { id: data.id }),
    }
    const resp: any = isNewStore ? await conn.post(obj,'GAPP/Store.php') : await conn.put(obj,'GAPP/Store.php');
    if(resp) {
      console.log(resp.message);
    }
  
    if(resetDataStore) {
      resetDataStore();
    }
    
    if(resetForm){
      resetForm();
    }
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
            <button className={`btn btn-success w-100`} onClick={handleSubmit2}>
              <i className={`fa-sharp fa-solid ${isNewStore ? 'fa-paper-plane' : 'fa-arrows-rotate'} text-white`}></i>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Form;
