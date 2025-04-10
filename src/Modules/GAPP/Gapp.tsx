import React, { useState, useEffect } from 'react';
import CardInfo from './Component/CardInfo/CardInfo';
import Form from './Component/Form/Form';
import NavBar from '../../Components/NavBar';
import { listPath } from '../GTPP/mock/configurationfile';
import useWindowSize from './hook/useWindowSize';
import { Connection } from '../../Connection/Connection';
import { IFormData, IFormGender } from './Interfaces/IFormGender';
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
        status_store: 1,
    });
    const [hiddenNav, setHiddeNav] = useState(false);
    const [hiddenForm, setHiddeForm] = useState(true);
    const [visibilityTrash, setVisibilityTrash] = useState(true);
    const [visibilityList, setVisibilityList] = useState(false);
    const { isTablet, isMobile, isDesktop } = useWindowSize();
    const [dataStore, setDataStore] = useState<IFormData | []>([]);
    const [dataStoreTrash, setDataStoreTrash] = useState<IFormData | []>([]);
    const consultingCEP = async (cep: string) => {
        if (cep.length !== 8) {
            console.log('O CEP deve conter 8 dígitos.');
            return;
        }
        console.log(null);
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
            console.log('Erro ao consultar o CEP.');
        }
    };
    useEffect(() => {
        if (data.zip_code.length === 8) {
            consultingCEP(data.zip_code);
        }
    }, [data.zip_code]);
    const connectionBusiness = async () => {
        try {
            const response = await new Connection("18");
            let data:any = await response.get('&status_store=1', 'GAPP/Store.php');
            if (data && data.data) {
                setDataStore(data.data);
            } else {
                console.error("No valid data returned from the server.");
            }
        } catch (error) {
            console.error("An error occurred while fetching the data:", error);
        }
    };
    const connectionBusinessTrash = async () => {
        const response = await new Connection("18");
        let data: any = await response.get('&status_store=0', 'GAPP/Store.php');
        setDataStoreTrash(data.data);
    };
      useEffect(() => {
        connectionBusiness();
        connectionBusinessTrash();
      }, []);
    function resetStore() {
        setDataStore([]);
        connectionBusiness();

        setDataStoreTrash([]);
        connectionBusinessTrash();
    }
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
            status_store: 1,
        });
    };
    const FormComponent = () => (
        <div className={`d-flex col-12 col-sm-12 col-lg-${isTablet ? '3' : '2'}`}>
            <Form
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
                resetDataStore={resetStore}
                resetForm={resetForm}
                data={data} 
            />
        </div>
    );
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
            return <CardInfo resetDataStore={resetStore} visibilityTrash={visibilityTrash} dataStore={dataStore} dataStoreTrash={dataStoreTrash} setData={setData} setHiddenForm={setHiddeForm} />
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
                    <div className='w-100'>
                        <h1 className='title_business'>Cadastro de empresas</h1>
                    </div>
                    <div className='form-control button_filter bg-white bg-opacity-75 shadow m-2 d-flex flex-column align-items-center position-absolute'>
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