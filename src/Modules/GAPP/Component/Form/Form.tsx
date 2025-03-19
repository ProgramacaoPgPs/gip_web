import React from 'react';
import CustomForm from '../../../../Components/CustomForm';
import { fildsetsFormsBusiness } from '../../mock/configuration';
import { handleNotification } from '../../../../Util/Util';
import { Connection } from '../../../../Connection/Connection';
import MinimalFilterModel from '../../../GTPP/ComponentsCard/MinimalFilterModel/MinimalFilterModel';

interface IFormProps {
    data: any;
    handleFunction: [
      (value: string) => void, // handleFildCNPJ
      (value: string) => void, // handleFieldName
      (value: string) => void, // handleFieldStreet
      (value: string) => void, // handleFieldDistrict
      (value: string) => void, // handleFieldCity
      (value: string) => void, // handleFieldState
      (value: string) => void, // handleFieldNumber
      (value: string) => void, // handleFieldZipCode
      (value: string) => void, // handleFieldComplement
      (value: number) => void, // handleFieldStoreVisible
    ];
    errorCep: any;
}
  

const Form: React.FC<IFormProps> = ({ data, handleFunction, errorCep }) => {

  const states: Array<any> = [
    { value: 'AC', label:'AC' },
    { value: 'AL', label:'AL' },
    { value: 'AP', label:'AP' },
    { value: 'AM', label:'AM' },
    { value: 'BA', label:'BA' },
    { value: 'CE', label:'CE' },
    { value: 'DF', label:'DF' },
    { value: 'ES', label:'ES' },
    { value: 'GO', label:'GO' },
    { value: 'MA', label:'MA' },
    { value: 'MT', label:'MT' },
    { value: 'MS', label:'MS' },
    { value: 'MG', label:'MG' },
    { value: 'PA', label:'PA' },
    { value: 'PB', label:'PB' },
    { value: 'PR', label:'PR' },
    { value: 'PE', label:'PE' },
    { value: 'PI', label:'PI' },
    { value: 'RJ', label:'RJ' },
    { value: 'RN', label:'RN' },
    { value: 'RS', label:'RS' },
    { value: 'RO', label:'RO' },
    { value: 'RR', label:'RR' },
    { value: 'SC', label:'SC' },
    { value: 'SP', label:'SP' },
    { value: 'SE', label:'SE' },
    { value: 'TO', label:'TO' },
  ]

  const [
    handleFildCNPJ,
    handleFieldName,
    handleFieldStreet,
    handleFieldDistrict,
    handleFieldCity,
    handleFieldState,
    handleFieldNumber,
    handleFieldZipCode,
    handleFieldComplement,
  ] = handleFunction;

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
    states,
    data,
    errorCep,
    handleNotification,
  );

  const postStore = async () => {
    let connection = new Connection("15")
    await connection.post({
      "cnpj": data.cnpj,
      "name": data.name,
      "street": data.street,
      "district": data.district,
      "city": data.city,
      "state": data.state,
      "number": data.number,
      "zip_code": data.zip_code,
      "complement": data.complement,
      "store_visible": data.store_visible
    }, "GAPP/Store.php");
  }

  const putStore = async () => { 
      let connection = new Connection("15")
      await connection.put({
        "id": data.id,
        "cnpj": data.cnpj.replace(/[^a-z0-9]/gi, ""),
        "name": data.name,
        "street": data.street,
        "district": data.district,
        "city": data.city,
        "state": data.state,
        "number": data.number,
        "zip_code": data.zip_code,
        "complement": data.complement,
        "store_visible": data.store_visible
      }, "GAPP/Store.php");
  }

  return (
    <React.Fragment>
      <div className='col-12 form-control bg-white bg-opacity-75 shadow m-2 w-100 d-flex flex-column justify-content-between'>
      <CustomForm
        classRender='flex-wrap'
        classButton='btn btn-success'
        className='p-3'
        notButton={false}
        fieldsets={filter}
      />
        
        <div className='row'>
          <div className="d-flex justify-content-center p-2">
              {[data].length > 0 ? (
                <React.Fragment>
                  <button className={`btn ${true ? 'btn-success' : 'btn-warning'} w-100`} onClick={() =>{ 
                    handleNotification("Dado salvo com sucesso!", "", "success");
                    postStore();
                  }}>
                    <i className={`fa-sharp fa-solid ${true ? 'fa-paper-plane' : 'fa-arrows-rotate'} text-white`}></i>
                  </button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <button className={`btn ${true ? 'btn-warning' : 'btn-warning'} w-100`} onClick={() => {
                      handleNotification("Dado atualizado com sucesso!", "", "warning");
                      putStore();
                    }}>
                    <i className="fa-solid fa-arrows-rotate text-white"></i>
                  </button>
                </React.Fragment>
              )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Form;
