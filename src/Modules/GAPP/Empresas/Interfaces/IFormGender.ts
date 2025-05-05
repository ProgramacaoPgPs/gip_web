export interface IFormGender {
    cnpj: string;
    name: string;
    street: string;
    district: string;
    city: string;
    state: string;
    number: string;
    zip_code: string;
    complement: string;
    status_store: number;
}

export interface IDataDB {
    data: {
        cnpj: string;
        name: string;
        street: string;
        district: string;
        city: string;
        state: string;
        number: string;
        zip_code: string;
        complement: string;
        status_store: number;
    };
}


export interface IFormData {
  id?: string;
  cnpj: string;
  name: string;
  street: string;
  district: string;
  city: string;
  state: string;
  number: string;
  zip_code: string;
  complement: string;
  status_store: number;
}

export interface IFormProps {
  data?: IFormData;
  handleFunction?: [
    (value: string) => void,
    (value: string) => void,
    (value: string) => void,
    (value: string) => void,
    (value: string) => void,
    (value: string) => void,
    (value: string) => void,
    (value: string) => void,
    (value: string) => void,
    (value: number) => void,
  ];
  resetDataStore?: () => void;
  resetForm?: () => void;
  setData?:any;
}

export interface ICardInfoProps {
    setData?: any;
    setHiddenForm?: any;
    visibilityTrash?: any;
    dataStore?: any;
    dataStoreTrash?: any;
    resetDataStore?: () => void;
}