import React, { useState } from 'react';
import CardInfo from './Component/CardInfo/CardInfo';
import Form from './Component/Form/Form';

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

    return (
        <div>
            <Form handleFunction={[
                (value: string) => setData(x => ({...x, cnpj: value})),
                (value: string) => setData(x => ({...x, name: value})),
                (value: string) => setData(x => ({...x, street: value})),
                (value: string) => setData(x => ({...x, district: value})),
                (value: string) => setData(x => ({...x, city: value})),
                (value: string) => setData(x => ({...x, state: value})),
                (value: string) => setData(x => ({...x, numberEstabelicity: value})),
                (value: string) => setData(x => ({...x, zipCode: value})),
                (value: string) => setData(x => ({...x, complement: value})),
                (value: boolean) => setData(x => ({...x, isFavorite: value})),
            ]} data={data} />
            <CardInfo onDelete={() => console.log('deletando')} onEdit={() => console.log('Editando')} data={data} />
        </div>
    );
}

export default Gapp;
