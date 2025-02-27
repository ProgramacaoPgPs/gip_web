import React, { useEffect, useState } from 'react';
import { listPath } from '../GTPP/mock/mockTeste';
import NavBar from '../../Components/NavBar';
import { fetchNodeDataFull } from '../../Util/Util';
import CustomNavbar from './Components/CustomNavbar';
import { navItems } from './Data/configs';

export default function Cfpp() {
    const [tokenCFPP, setTokenCFPP] = useState<string>('');
    const [recordType, setRecordType] = useState<[{ id_record_type: number; description: string; status: number }]>([{ id_record_type: 0, description: '', status: 0 }]);

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
    }, []);

    useEffect(() => {
        (
            async () => {
                await loadRecordType()
            }
        )();
    }, [tokenCFPP]);

    async function loadTokenCFPP() {
        if (!sessionStorage.tokenCFPP) {
            const data = await fetchNodeDataFull({
                method: 'POST',
                params: { session: sessionStorage.tokenGIPP },
                pathFile: '/api/auth/login',
                port: "5000",
            }, { 'Content-Type': 'application/json' });
            if (data.error) throw new Error(data.message);
            sessionStorage.setItem("tokenCFPP", data?.data);
        }
    }

    async function loadRecordType() {
        try {
            if (tokenCFPP) {
                const reqRecordType: { error: boolean; message?: string; data?: [{ id_record_type: number; description: string; status: number }] } = await fetchNodeDataFull({
                    method: 'GET',
                    params: null,
                    pathFile: `/api/GIPP/GET/Employees/employees?activeOnly=1`,
                    port: "5000",
                }, { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenCFPP}` });
                if ('message' in reqRecordType && reqRecordType.error) throw new Error(reqRecordType.message);
                reqRecordType.data && setRecordType(reqRecordType.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='d-flex flex-row w-100 h-100 container-fluid p-0 m-0'>
            <NavBar list={listPath} />
            <section className='overflow-auto flex-grow-1'>
                <CustomNavbar items={navItems}/>
            </section>
        </div>
    );
}