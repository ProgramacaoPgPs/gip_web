import React, { useState, useEffect } from 'react';
import CardInfo from './Component/CardInfo/CardInfo';
import Form from './Component/Form/Form';
import CustomNavbar from '../CFPP/Components/CustomNavbar';
import { navItems } from '../CFPP/Data/configs';
import NavBar from '../../Components/NavBar';
import { listPath } from '../GTPP/mock/configurationfile';

interface IFormGender {
    cnpj: string;
    name: string;
    street: string;
    district: string;
    city: string;
    state: string;
    numberEstabelicity: string;
    zipCode: string;
    complement: string;
    isFavorite: boolean;
}

const Gapp: React.FC = () => {
    const [data, setData] = useState<IFormGender>({
        cnpj: "",
        name: "",
        street: "",
        district: "",
        city: "",
        state: "",
        numberEstabelicity: "",
        zipCode: "",
        complement: "",
        isFavorite: false
    });

    const [erro, setErro] = useState<string | null>(null);
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
                setErro('CEP não encontrado');
            } else {
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
        if (data.zipCode.length === 8) {
            consultingCEP(data.zipCode);
        }
    }, [data.zipCode]);

    return (
        <React.Fragment>
            <NavBar list={listPath} />
            <div className='container'>
            <div className='d-flex justify-content-between gap-5'>
                    <div className='d-flex flex-none col-4'>
                    <Form
                        errorCep={erro}
                        handleFunction={[
                            (value: string) => setData(x => ({ ...x, cnpj: value })),
                            (value: string) => setData(x => ({ ...x, name: value })),
                            (value: string) => setData(x => ({ ...x, street: value })),
                            (value: string) => setData(x => ({ ...x, district: value })),
                            (value: string) => setData(x => ({ ...x, city: value })),
                            (value: string) => setData(x => ({ ...x, state: value })),
                            (value: string) => setData(x => ({ ...x, numberEstabelicity: value })),
                            (value: string) => setData(x => ({ ...x, zipCode: value })),
                            (value: string) => setData(x => ({ ...x, complement: value })),
                            (value: boolean) => setData(x => ({ ...x, isFavorite: value })),
                        ]}
                        data={data} />
                    </div>
                    <CardInfo 
                        onDelete={() => console.log('deletando')} 
                        onEdit={() => console.log('Editando')} 
                        data={data} 
                    />
            </div>
            </div>
        </React.Fragment>
    );
};

export default Gapp;
