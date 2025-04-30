import React, { useEffect, useState } from 'react';
import { listPath } from '../GTPP/mock/configurationfile';
import NavBar from '../../Components/NavBar';
import { convertForTable, fetchNodeDataFull } from '../../Util/Util';
import CustomNavbar from './Components/CustomNavbar';
import { navItems } from './Data/configs';
import { useMyContext } from '../../Context/MainContext';
import TimeRecords from './Components/TimeRecords';
import Calculation from './Components/Calculation';
import CustomForm from '../../Components/CustomForm';
import TableComponent from '../../Components/CustomTable';


export default function Cfpp() {
    const { setTitleHead } = useMyContext();
    const [tokenCFPP, setTokenCFPP] = useState<string>('');
    const [refNav, setRefNav] = useState<string>('reports');
    useEffect(() => {
        (
            async () => {
                try {
                    await loadTokenCFPP();
                } catch (error) {
                    console.error(error);
                } finally {
                    setTokenCFPP(sessionStorage.tokenCFPP);
                }

            }
        )();
        setTitleHead({
            title: "Controle de Folgas Peg Pese - CFPP",
            simpleTitle: "CFPP",
            icon: "fa-solid fa-calendar-days",
        });
    }, []);

    async function loadTokenCFPP() {
        if (!sessionStorage.tokenCFPP) {
            const data = await fetchNodeDataFull({
                method: 'POST',
                params: { session: localStorage.tokenGIPP },
                pathFile: '/api/auth/login',
                port: "5000",
            }, { 'Content-Type': 'application/json' });
            if (data.error) throw new Error(data.message);
            sessionStorage.setItem("tokenCFPP", data?.data);
        }
    }
    return (
        <div className='d-flex flex-row w-100 h-100 container-fluid p-0 m-0'>
            <NavBar list={listPath} />

            <section className='d-none d-sm-flex flex-column overflow-hidden h-100 w-100 p-2'>
                <CustomNavbar items={navItems(setRefNav)} />
                {refNav.includes('register') && <TimeRecords tokenCFPP={tokenCFPP} loadTokenCFPP={loadTokenCFPP} />}
                {refNav.includes('payments') && <Calculation tokenCFPP={tokenCFPP} loadTokenCFPP={loadTokenCFPP} />}
                {refNav.includes('reports') && <ReportsCFPP tokenCFPP={tokenCFPP} loadTokenCFPP={loadTokenCFPP} />}
            </section>

            <section className='d-flex d-sm-none align-items-center justify-content-center'>
                <h1 className='w-75'>Ops! Não é possível acesso via mobile</h1>
            </section>
        </div>
    );
}

function ReportsCFPP({ tokenCFPP, loadTokenCFPP }: { tokenCFPP: string, loadTokenCFPP: () => Promise<void> }): JSX.Element {
    const [status, setStatus] = useState<any[]>([]);
    const [statusSelected, setStatusSelected] = useState<number>(0);
    const [list, setList] = useState<any[]>([]);
    const { setLoading } = useMyContext();
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                if (tokenCFPP) {
                    const reqStatus: { error: boolean; message?: string; data?: any[] } = await fetchNodeDataFull({
                        method: 'GET',
                        params: null,
                        pathFile: `/api/GIPP/GET/CFS/status`,
                        port: "5000",
                    }, { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip, compress, br', 'Authorization': `Bearer ${tokenCFPP}` });
                    if ('message' in reqStatus && reqStatus.error) throw new Error(reqStatus.message);
                    if (reqStatus.data) setStatus(reqStatus.data.map(item => { return { label: item.name, value: item.id_status } }));
                }
            } catch (error: any) {
                if (error.message.includes('Invalid or expired token')) {
                    sessionStorage.removeItem('tokenCFPP');
                    await loadTokenCFPP();
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [tokenCFPP]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                if (tokenCFPP) {
                    console.log(statusSelected, "Aqui estou eu");
                    const reqStatus: { error: boolean; message?: string; data?: any[] } = await fetchNodeDataFull({
                        method: 'GET',
                        params: null,
                        pathFile: `/api/GIPP/GET/CFS/trfs`,
                        port: "5000",
                        urlComplement: statusSelected != 0 ? `?statusCod=${statusSelected}` : ''
                    }, { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip, compress, br', 'Authorization': `Bearer ${tokenCFPP}` });
                    if ('message' in reqStatus && reqStatus.error) throw new Error(reqStatus.message);
                    console.log(reqStatus);
                    if (reqStatus.data) setList(reqStatus.data);
                }
            } catch (error: any) {
                if (error.message.includes('Invalid or expired token')) {
                    sessionStorage.removeItem('tokenCFPP');
                    await loadTokenCFPP();
                }
            } finally {
                setLoading(false);
            }

        })();
    }, [statusSelected, tokenCFPP]);

    return (
        <div className='d-flex flex-grow-1 overflow-hidden'>
            <div className='col-2 col-md-3 col-lg-3  col-xxl-2 h-100'>
                <CustomForm
                    classButton='btn btn-success my-2'
                    titleButton='Buscar'
                    fieldsets={
                        [{
                            attributes: { className: 'col-6 overflow-hidden', },
                            item: {
                                label: 'Comp.',
                                captureValue: {
                                    type: 'select',
                                    className: 'form-control',
                                    options: status,
                                    value: statusSelected,
                                    onChange: (e: any) => { setStatusSelected(parseInt(e.target.value)) }
                                    // required: true,
                                },
                            }
                        }]
                    } />
            </div>
            <div className='col-10 col-lg-9  col-xxl-10 h-100'>
                {
                    list.length > 0 &&
                    <TableComponent
                        maxSelection={1}
                        list={convertForTable(list)}
                        onConfirmList={(items: any) => {
                            if (items.length > 0) {
                                console.log(items);
                            }
                        }}
                    />
                }
            </div>
        </div>
    );
}