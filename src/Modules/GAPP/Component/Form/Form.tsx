import React from 'react';
import CustomForm from '../../../../Components/CustomForm';
import { fildsetsFormsBusiness } from '../../mock/configuration';
import { handleNotification } from '../../../../Util/Util';

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
      (value: boolean) => void, // handleFieldFavorite
    ];
    errorCep: any;
}
  

const Form: React.FC<IFormProps> = ({ data, handleFunction, errorCep }) => {
  const handleSubmit = () => {
    console.log('Form submitted', data);
  };

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
    handleFieldFavorite,
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
    handleFieldFavorite,
    states,
    data,
    errorCep,
    handleNotification,
  );

  return (
    <React.Fragment>
      <div className=''>
        <CustomForm
          classRender='flex-wrap'
          classButton='btn btn-success'
          onSubmit={handleSubmit}
          titleButton=""
          className='p-3'
          notButton={false}
          fieldsets={filter}
        />
        <div className='row'>
          <div className="d-flex justify-content-center p-2">
            <button className={`btn ${true ? 'btn-success' : 'btn-warning'}`} onClick={() => console.log('teste')}>
              <i className={`fa-sharp fa-solid ${true ? 'fa-paper-plane' : 'fa-arrows-rotate'} text-white`}></i>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Form;
