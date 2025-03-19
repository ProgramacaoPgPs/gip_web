import React, { useState, useEffect } from 'react';
import CardInfo from './Component/CardInfo/CardInfo';
import Form from './Component/Form/Form';
import NavBar from '../../Components/NavBar';
import { listPath } from '../GTPP/mock/configurationfile';
import { Connection } from '../../Connection/Connection';
import { handleNotification } from '../../Util/Util';

interface IFormGender {
    cnpj: string;
    name: string;
    street: string;
    district: string;
    city: string;
    state: string;
    number: string;
    zip_code: string;
    complement: string;
    store_visible: number;
}

const Gapp: React.FC = () => {
    const [data, setData] = useState<IFormGender>({
        cnpj: "",
        name: "",
        street: "",
        district: "",
        city: "",
        state: "",
        number: "",
        zip_code: "",
        complement: "",
        store_visible: 1,
    } as IFormGender);
    const [erro, setErro] = useState<string | null>(null);
    const [dataStore, setDataStore] = useState<[]>([]);

    const consultingCEP = async (cep: string) => {
        if (cep.length !== 8) {
            setErro('O CEP deve conter 8 dígitos.');
            return;
        }
        setErro(null);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                handleNotification("Atenção!", "Cep não encontrado", "danger");
            } else {
                handleNotification("Sucesso!", "Cep econtrado com sucesso!", "success");
                setData(prevData => ({
                    ...prevData,
                    street: data.logradouro || '',
                    district: data.bairro || '',
                    city: data.localidade || '',
                    state: data.uf || ''
                }));
            }
        } catch (error) {
            setErro('Erro ao consultar o CEP.');
        }
    };

    useEffect(() => {
        if (data.zip_code.length === 8) {
            consultingCEP(data.zip_code);
        }
    }, [data.zip_code]);

    const connectionBusiness = async () => {
      const response = await new Connection("18");
      let data: any = await response.get('&all=true', 'GAPP/Store.php');
      setDataStore(data.data);
    }
  
    useEffect(() => {
      connectionBusiness();
    }, [])

    return (
        <React.Fragment>
            <NavBar list={listPath} />
            <div className='container'>
            <div className='form-control bg-white bg-opacity-75 shadow m-2 w-100' style={{height:40 }}>

            </div>
            <div className='d-flex justify-content-between gap-5'>
                    <div className='d-flex flex-none col-3'>
                    <Form
                        errorCep={erro}
                        handleFunction={[
                            (value: string) => setData(x => ({ ...x, cnpj: value })),
                            (value: string) => setData(x => ({ ...x, name: value })),
                            (value: string) => setData(x => ({ ...x, street: value })),
                            (value: string) => setData(x => ({ ...x, district: value })),
                            (value: string) => setData(x => ({ ...x, city: value })),
                            (value: string) => setData(x => ({ ...x, state: value })),
                            (value: string) => setData(x => ({ ...x, number: value })),
                            (value: string) => setData(x => ({ ...x, zip_code: value })),
                            (value: string) => setData(x => ({ ...x, complement: value })),
                            (value: number) => setData(x => ({ ...x, store_visible: value })),
                        ]}
                        data={data} />
                    </div>
                    
                    <CardInfo 
                            onDelete={() => console.log('deletar vai ser uma atualização da visibilidade amanhã estamos terminando essa parte!')} 
                            data={data}
                            dataStore={dataStore}
                            setData={setData}
                        />
            </div>
            </div>
        </React.Fragment>
    );
};

export default Gapp;
