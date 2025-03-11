import React, { useEffect, useState } from 'react';
import { listPath } from '../GTPP/mock/configurationfile';
import NavBar from '../../Components/NavBar';
import { convertForTable, fetchNodeDataFull, getFormattedDate } from '../../Util/Util';
import CustomNavbar from './Components/CustomNavbar';
import { navItems } from './Data/configs';
import { useMyContext } from '../../Context/MainContext';
import SearchUserCFPP from './Components/SearchUserCFPP';
import TableComponent from '../../Components/CustomTable';
import { InputCheckButton } from '../../Components/CustomButton';

export default function Cfpp() {
    const { setTitleHead } = useMyContext();
    const [tokenCFPP, setTokenCFPP] = useState<string>('');
    const [listRegister, setListRegister] = useState<{}[]>([]);
    const [date, setDate] = useState<string>('');
    const [hour, setHour] = useState<string>('');
    const [typeRecord, setTypeRecord] = useState<string>('');
    const [timeRecords, setTimeRecords] = useState<any[]>([]);
    const [recordType, setRecordType] = useState<any[]>([]);
    const [openSelectEmployee, setOpenSelectEmployee] = useState<boolean>(false);
    const [employee, setEmployee] = useState<{ EmployeeID: string, EmployeeName: string, CostCenterDescription: string, BranchName: string }>({ EmployeeID: '', EmployeeName: '', CostCenterDescription: '', BranchName: '' });

    useEffect(() => {
        (
            async () => {
                try {
                    await loadTokenCFPP();
                    // await loadPayment();    
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

    useEffect(() => {
        (async () => {
            await loadTimeRecords();
            await loadRecordType();
        })();
    }, [tokenCFPP]);

    useEffect(()=>{console.log(listRegister)},[listRegister]);

    async function loadRecordType() {
        try {
            if (tokenCFPP) {
                const reqRecordType: { error: boolean; message?: string; data?: any[] } = await fetchNodeDataFull({
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

    async function loadTimeRecords() {
        try {
            if (tokenCFPP) {
                const reqTimeRecords: { error: boolean; message?: string; data?: any[] } = await fetchNodeDataFull({
                    method: 'GET',
                    params: null,
                    pathFile: `/api/GIPP/GET/Employees/timeRecords`,
                    port: "5000",
                }, { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenCFPP}` });
                if ('message' in reqTimeRecords && reqTimeRecords.error) throw new Error(reqTimeRecords.message);
                reqTimeRecords.data && setTimeRecords(reqTimeRecords.data);
            }
        } catch (error) {
            console.error(error);
        }
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

    function handlerSelectEmployee(value?: any) {
        value && handlerEmployee(value);
        setOpenSelectEmployee(!openSelectEmployee);
    }

    function handlerEmployee(objects: any[]) {
        objects.forEach(object => {
            setEmployee({
                EmployeeID: object.EmployeeID.value,
                EmployeeName: object.EmployeeName.value,
                CostCenterDescription: object.CostCenterDescription.value,
                BranchName: object.BranchName.value
            });
        })
    }

    return (
        <div className='d-flex flex-row w-100 h-100 container-fluid p-0 m-0'>
            <NavBar list={listPath} />
            <section className='d-flex flex-column overflow-auto h-100 w-100'>
                <div style={{ height: "35%" }}>
                    <CustomNavbar items={navItems} />
                    {
                        openSelectEmployee &&
                        <div style={{ zIndex: '1' }} className='position-absolute d-flex flex-column justify-content-between h-100 w-100 top-0 start-0 bg-white py-2 overflow-hidden'>
                            <SearchUserCFPP onCallBack={handlerSelectEmployee} tokenCFPP={tokenCFPP} />
                        </div>
                    }
                    <button type='button' title='Adicionar marcação' onClick={() => handlerSelectEmployee()} className='btn btn-light fa-solid fa-square-plus mx-2' />
                    <div className='row ps-2 w-100'>
                        <div className='col-2'>
                            <label className='form-check-label'>Matrícula:</label>
                            <input value={employee.EmployeeID} disabled type='text' className='form-control' />
                        </div>
                        <div className='col-3'>
                            <label className='form-check-label'>Nome:</label>
                            <input value={employee.EmployeeName} disabled type='text' className='form-control' />
                        </div>
                        <div className='col-2'>
                            <label className='form-check-label'>C.C.:</label>
                            <input value={employee.CostCenterDescription} disabled type='text' className='form-control' />
                        </div>
                        <div className='col-3'>
                            <label className='form-check-label'>Filial:</label>
                            <input value={employee.BranchName} disabled type='text' className='form-control' />
                        </div>
                        <div className='col-2'>
                            <label className='form-check-label'>Data:</label>
                            <input value={date} onChange={(element: React.ChangeEvent<HTMLInputElement>) => setDate(element.target.value)} type='date' className='form-control' />
                        </div>
                        <div className='col-2'>
                            <label className='form-check-label'>Hora:</label>
                            <input value={hour} onChange={(element: React.ChangeEvent<HTMLInputElement>) => setHour(element.target.value)} type='time' className='form-control' />
                        </div>
                        <div className='col-2'>
                            <label className='form-check-label'>Tipo de lançamento:</label>
                            <select value={typeRecord} onChange={(element: React.ChangeEvent<HTMLSelectElement>) => setTypeRecord(element.target.value)} id='id_record_type_fk' className='form-control'>
                                <option value='' hidden></option>
                                {recordType.map(record => <option key={`op_${record.id_record_type}`} value={record.id_record_type}>{record.description}</option>)}
                            </select>
                        </div>
                        <div className='d-flex col-1 align-items-end'>
                            <button type='button' className='btn btn-primary me-2' onClick={async () => { 
                                let newList = listRegister;
                                newList.push({
                                    id_record_type_fk: typeRecord,
                                    times: `${date} ${hour}`
                                });
                                setListRegister([...newList]);
                             }}>+</button>
                        </div>
                        <div className='d-flex col-2 align-items-end'>
                            <button type='button' className='btn btn-success' onClick={async () => {
                                const params = {
                                    employee_id: employee.EmployeeID,
                                    id_record_type_fk: typeRecord,
                                    times: `${date} ${hour}`
                                }

                                // Seleciona o elemento <select> pelo ID <i class="fa-solid fa-plus"></i>

                                const data = await fetchNodeDataFull({
                                    method: 'POST',
                                    params: params,
                                    pathFile: '/api/GIPP/POST/Employees',
                                    port: "5000",
                                }, { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenCFPP}` });
                                console.log(data);
                            }
                            }>Registrar</button>
                        </div>
                    </div>
                </div>
                <div style={{ height: "65%" }} className='w-100'>
                    {timeRecords.length > 0 && <TableComponent list={convertForTable(timeRecords, {
                        ocultColumns: ['times', 'id_time_records', 'created_at', 'updated_at', 'id_global'],
                        customTags: { employee_id: 'Matrícula', id_status_fk: 'Cód. Status', id_record_type_fk: 'Cód. Marcação', cod_work_schedule: 'Cód. Jornada', employee_name: 'Nome', date: 'Data', hour: 'Horário', cost_center_description: 'C.C', branch_name: 'Filial' },
                        minWidths: { time: "75px", date: '85px', employee_id: '100px', id_status_fk: '110px', id_record_type_fk: '145px', cod_work_schedule: '100px' }
                    })} onConfirmList={(item) => { console.log(item); }} />}
                </div>
            </section>
        </div>
    );
}