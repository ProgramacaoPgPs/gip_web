import React, { useEffect, useState } from 'react';
import { listPath } from '../GTPP/mock/configurationfile';
import NavBar from '../../Components/NavBar';
import { fetchNodeDataFull } from '../../Util/Util';
import CustomNavbar from './Components/CustomNavbar';
import { navItems } from './Data/configs';
import { useMyContext } from '../../Context/MainContext';
import TimeRecords from './Components/TimeRecords';
import Calculation from './Components/Calculation';


export default function Cfpp() {
    const { setTitleHead } = useMyContext();
    const [tokenCFPP, setTokenCFPP] = useState<string>('');
    const [onTimeRecords, setOnTimeRecords] = useState(true);
    const [onCalculation, setOnCalculation] = useState(false);

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

    function handlerTimeRecords() {
        setOnTimeRecords(true);
        setOnCalculation(false);
    }
    function handlerCalculation() {
        setOnCalculation(true);
        setOnTimeRecords(false);
    }

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
                <CustomNavbar items={navItems(handlerTimeRecords, handlerCalculation)} />
                {onTimeRecords && <TimeRecords tokenCFPP={tokenCFPP} loadTokenCFPP={loadTokenCFPP} />}
                {onCalculation && <Calculation tokenCFPP={tokenCFPP} loadTokenCFPP={loadTokenCFPP} />}
            </section>

            <section className='d-flex d-sm-none align-items-center justify-content-center'>
                <h1 className='w-75'>Ops! Não é possível acesso via mobile</h1>
            </section>
        </div>
    );
}