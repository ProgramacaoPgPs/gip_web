import React, { useState, useEffect } from 'react';
import CardInfo from './Component/CardInfo/CardInfo';
import Form from './Component/Form/Form';
import NavBar from '../../Components/NavBar';
import { listPath } from '../GTPP/mock/configurationfile';
import useWindowSize from './hook/useWindowSize';

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
    });
    const [erro, setErro] = useState<string | null>(null);
    
    const [hiddenNav, setHiddeNav] = useState(false);
    const [hiddenForm, setHiddeForm] = useState(true);
    const [visibilityTrash, setVisibilityTrash] = useState(true);
    const [visibilityList, setVisibilityList] = useState(false);
    const { isTablet, isMobile, isDesktop } = useWindowSize();

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
                console.log('Erro no CEP');
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
        if (data.zip_code.length === 8) {
            consultingCEP(data.zip_code);
        }
    }, [data.zip_code]);

    

    const resetForm = () => {
        setData({
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
        });
    };

    const FormComponent = () => (
        <div className="d-flex col-12 col-sm-12 col-lg-2">
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
                // resetDataStore={resetDataStore}
                resetForm={resetForm}
                data={data} 
            />
        </div>
    );

    /* filtro de botão */
    function menuButtonFilter() {
        return (
            <React.Fragment>
                {(isMobile || isTablet) && (
                    <button className='btn' onClick={() => setHiddeNav((prev) => !prev)}>
                        <i className={`fa-regular ${hiddenNav ? 'fa-eye' : 'fa-eye-slash'} `}></i>
                    </button>
                )}
                {(isMobile || isTablet) && (
                    <button className='btn' onClick={() => setHiddeForm((prev) => !prev)}>
                        <i className={`fa-solid ${hiddenForm ? 'fa-caret-up fa-rotate-180' : 'fa-caret-up'}`}></i>
                    </button>
                )}
                <button className='btn' onClick={resetForm}>
                    <i className="fa-solid fa-eraser"></i>
                </button>
                <button className='btn' onClick={() => setVisibilityTrash((prev) => !prev)}>
                    <i className={`fa-solid fa-trash ${!visibilityTrash ? 'text-danger' : ''}`}></i>
                </button>
            </React.Fragment>
        )
    }


    function visibilityInterleave() {
        function CardInfoSimplify() {
            return <CardInfo visibilityTrash={visibilityTrash} setData={setData} setHiddenForm={setHiddeForm} />
        }
        return isMobile || isTablet ? (
            <React.Fragment>
                {hiddenForm && FormComponent()}
                {!hiddenForm && CardInfoSimplify()}
            </React.Fragment>
        ) : (
            <React.Fragment>
                {FormComponent()}
                {CardInfoSimplify()}
            </React.Fragment>
        )
    }


    return (
        <React.Fragment>
            {(isMobile || isTablet) && hiddenNav ? (
                <NavBar list={listPath} />
            ) : isDesktop ? (
                <NavBar list={listPath} />
            ) : null}

            <div className='container'>
                <div className='justify-content-between align-items-center px-2 position-relative'>
                    {!isMobile && (
                        <div className='w-100'>
                            <h1 style={{ fontSize: 25, fontWeight: 600 }}>Cadastro de empresas</h1>
                        </div>
                    )}
                    <div
                        className='form-control bg-white bg-opacity-75 shadow m-2 d-flex flex-column align-items-center position-absolute'
                        style={{
                            width: isMobile ? '10.5%' : isTablet ? '5%' : '2.5%',
                            right: '-16px',
                            top: '-20%',
                        }}
                    >
                        <button className='btn' onClick={() => setVisibilityList((prev) => !prev)}>
                            <i className="fa-solid fa-square-poll-horizontal"></i>
                        </button>
                        {visibilityList && menuButtonFilter()}
                    </div>
                </div>
                <div className={`d-flex justify-content-between gap-5 ${isMobile ? 'h-100' : ''}`}>
                    {visibilityInterleave()}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Gapp;
