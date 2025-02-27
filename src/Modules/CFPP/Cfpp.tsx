import React, { useEffect, useState } from 'react';
import { listPath } from '../GTPP/mock/mockTeste';
import NavBar from '../../Components/NavBar';
import { convertForTable, fetchNodeDataFull } from '../../Util/Util';
import CustomNavbar from './Components/CustomNavbar';
import { navItems } from './Data/configs';
import { useMyContext } from '../../Context/MainContext';
import TableComponent from '../../Components/CustomTable';

export default function Cfpp() {
    const { setTitleHead } = useMyContext();
    const [tokenCFPP, setTokenCFPP] = useState<string>('');
    const [recordType, setRecordType] = useState<[{ id_record_type: number; description: string; status: number }]>([{ id_record_type: 0, description: '', status: 0 }]);
    const [employees, setEmployees] = useState<any[]>([]);

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
            title: "Controle de Folgas  Peg Pese CFPP",
            simpleTitle: "CFPP",
            icon: "fa-solid fa-calendar-days",
        });
    }, []);

    useEffect(() => {
        (
            async () => {
                await loadRecordType();
                await loadEmployees();
            }
        )();
    }, [tokenCFPP]);
    useEffect(()=>console.log(employees),[employees])

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
                    pathFile: `/api/GIPP/GET/Employees/recordType`,
                    port: "5000",
                }, { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenCFPP}` });
                if ('message' in reqRecordType && reqRecordType.error) throw new Error(reqRecordType.message);
                reqRecordType.data && setRecordType(reqRecordType.data);
            }
        } catch (error) {
            console.error(error);
        }
    }
    async function loadEmployees() {
        try {
            if (tokenCFPP) {
                const reqEmployee: { error: boolean; message?: string; data?: any[] } = await fetchNodeDataFull({
                    method: 'GET',
                    params: null,
                    pathFile: `/api/GIPP/GET/Employees/employees`,
                    port: "5000",
                }, { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenCFPP}` });
                if ('message' in reqEmployee && reqEmployee.error) throw new Error(reqEmployee.message);
                reqEmployee.data && setEmployees(reqEmployee.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='d-flex flex-row w-100 h-100 container-fluid p-0 m-0'>
            <NavBar list={listPath} />
            <section className='d-flex flex-column overflow-auto flex-grow-1'>
                <CustomNavbar items={navItems} />
                <div className='h-50'>
                    {employees.length > 0 &&
                        <TableComponent
                            maxSelection={1}
                            list={convertForTable(employees, {
                                ocultColumns: ["EmployeeAdmiss","EmployeeDemiss"],
                                customTags: { description: "Descrição", status: "Status" }
                            })}
                            onConfirmList={(item) => console.log(item)}
                        />}
                </div>
            </section>
        </div>
    );
}