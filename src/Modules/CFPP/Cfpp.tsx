import React, { useEffect, useState } from 'react';
import { listPath } from '../GTPP/mock/configurationfile';
import NavBar from '../../Components/NavBar';
import { fetchNodeDataFull } from '../../Util/Util';
import CustomNavbar from './Components/CustomNavbar';
import { navItems } from './Data/configs';
import { useMyContext } from '../../Context/MainContext';
import TimeRecords from './Components/TimeRecords';


export default function Cfpp() {
    const { setTitleHead } = useMyContext();
    const [tokenCFPP, setTokenCFPP] = useState<string>('');

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
            <section className='d-flex flex-column overflow-hidden h-100 w-100'>
                <CustomNavbar items={navItems} />
                <TimeRecords tokenCFPP={tokenCFPP} loadTokenCFPP={loadTokenCFPP}/>
            </section>
        </div>
    );
}