import React, { useEffect, useState } from "react";
import { convertForTable, convertTime, fetchNodeDataFull } from "../../../Util/Util";
import TableComponent from "../../../Components/CustomTable";
import ListRegister from "./ListRegister";
import { useMyContext } from "../../../Context/MainContext";

export default function Calculation({ tokenCFPP, loadTokenCFPP }: { tokenCFPP: string, loadTokenCFPP: () => Promise<void> }) {
    const [payments, setPayments] = useState<any[]>([]);
    const [onDetailsTimeRecords, setOnDetailsTimeRecords] = useState(false);
    const [journeyCode, setJourneyCode] = useState<string>('');


    useEffect(() => {
        (async () => {
            await loadRecordType();
        })();
    }, [tokenCFPP]);

    useEffect(() => {
        (async () => {
            if (!journeyCode) {
                await loadRecordType();
            }
        })();
    }, [journeyCode]);

    async function loadRecordType() {
        try {
            if (tokenCFPP) {
                const reqPayment: { error: boolean; message?: string; data?: any[] } = await fetchNodeDataFull({
                    method: 'GET',
                    params: null,
                    pathFile: `/api/GIPP/GET/Employees/payment`,
                    port: "5000",
                }, { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip, compress, br', 'Authorization': `Bearer ${tokenCFPP}` });
                if ('message' in reqPayment && reqPayment.error) throw new Error(reqPayment.message);
                if (reqPayment.data) setPayments(reqPayment.data);
            }
        } catch (error: any) {
            if (error.message.includes('Invalid or expired token')) {
                sessionStorage.removeItem('tokenCFPP');
                await loadTokenCFPP();
            }
            console.error(error);
        }
    }

    return (
        <React.Fragment>
            <div className="flex-grow-1 overflow-hidden">
                {onDetailsTimeRecords && <DetailsTimeRecords onClose={() => { setOnDetailsTimeRecords(false); setJourneyCode('') }} journeyCode={journeyCode} />}
                <h1>Página para calcular a Hora!</h1>
                <div className="my-4 h-75">
                    {payments.length > 0 &&
                        <TableComponent
                            maxSelection={1}
                            list={convertForTable(payments)}
                            onConfirmList={(items: any) => {
                                if (items.length > 0) {
                                    setJourneyCode(items[0]["Cód. Jornada"]["value"]);
                                    setOnDetailsTimeRecords(true);
                                }
                            }}
                        />
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

function DetailsTimeRecords(props: { onClose: () => void; journeyCode: string }) {
    const [timeRecords, setTimeRecords] = useState<any[]>([]);
    const [user, setUser] = useState<any>({});
    const [record, setRecord] = useState<any>({});
    const [alterHour, setAlterHour] = useState<any>('');
    const [alterDate, setAlterDate] = useState<any>('');
    const { setLoading } = useMyContext();

    useEffect(() => {
        (async () => {
            await loadTimeRecords();
        })();
    }, []);

    useEffect(() => {
        if (Object.keys(record).length > 0) {
            setAlterDate(record.times.split('T')[0]);
            setAlterHour(record.times.replace('Z', '').split('T')[1]);
        }
    }, [record]);

    async function loadTimeRecords() {
        try {
            setLoading(true);
            if (localStorage.tokenGIPP) {
                const reqTimeRecords: { error: boolean; message?: string; data?: any[] } = await fetchNodeDataFull({
                    method: 'GET',
                    params: null,
                    pathFile: `/api/GIPP/GET/Employees/timeRecords`,
                    port: "5000",
                    urlComplement: `?codWorkSchedule=${props.journeyCode}`
                }, { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip, compress, br', 'Authorization': `Bearer ${sessionStorage.tokenCFPP}` });
                if ('message' in reqTimeRecords && reqTimeRecords.error) throw new Error(reqTimeRecords.message);
                if (reqTimeRecords.data) {
                    setTimeRecords(reqTimeRecords.data);
                    setUser(reqTimeRecords.data[0]);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    async function timeRecordsChange(id_time_records:number) {
        try {
            setLoading(true);
            if (localStorage.tokenGIPP) {
                const reqTimeRecords: { error: boolean; message?: string; data?: any[] } = await fetchNodeDataFull({
                    method: 'PUT',
                    params: {times:`${alterDate} ${alterHour}`,id_time_records},
                    pathFile: `/api/GIPP/PUT/Employees/timeRecords`,
                    port: "5000",
                }, { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip, compress, br', 'Authorization': `Bearer ${sessionStorage.tokenCFPP}` });
                if ('message' in reqTimeRecords && reqTimeRecords.error) throw new Error(reqTimeRecords.message);
                await loadTimeRecords();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function cancelTimeRecords() {
        try {
            setLoading(true);
            if (localStorage.tokenGIPP) {
                const reqTimeRecords: { error: boolean; message?: string; data?: any[] } = await fetchNodeDataFull({
                    method: 'PUT',
                    params: { cod_work_schedule: props.journeyCode },
                    pathFile: `/api/GIPP/PUT/Employees/timeRecords`,
                    port: "5000"
                }, { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip, compress, br', 'Authorization': `Bearer ${sessionStorage.tokenCFPP}` });
                if ('message' in reqTimeRecords && reqTimeRecords.error) throw new Error(reqTimeRecords.message);
                if (reqTimeRecords.data) {
                    setTimeRecords(reqTimeRecords.data);
                    setUser(reqTimeRecords.data[0]);
                }
                props.onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center bg-dark bg-opacity-25 position-absolute z-1 start-0 top-0 h-100 col-12">
            <div className="bg-white m-2 p-2 rounded col-6 col-sm-4 col-md-8 col-lg-6 col-xl-4">
                <header className="d-flex align-items-center justify-content-between">
                    <h1>Detalhes do registro dos horários</h1>
                    <button onClick={props.onClose} className="btn btn-danger" type="button" title="Fechar detalhes do registro">X</button>
                </header>
                <section className="row my-4 p-2 bg-light m-0">
                    <div className="d-flex align-items-center gap-2 col-6">
                        <strong>Filial:</strong>
                        <span>{user.branch_name}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 col-6">
                        <strong>Nome:</strong>
                        <span>{user.employee_name}</span>
                    </div>
                </section>
                <ListRegister onAction={(element) => setRecord(element)} noDelete={true} listRegister={timeRecords} setListRegister={setTimeRecords} />
                {
                    Object.keys(record).length > 0
                    &&
                    <div className="container my-2 border p-2 rounded bg-light">
                        <header className="d-flex justify-content-end">
                            <button onClick={() => setRecord({})} type="button" className="btn btn-secondary py-0">X</button>
                        </header>
                        <div className="row mb-3">
                            <div className="col-6">
                                <label>Data:</label>
                                <input className="form-control" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAlterDate(event.target.value)} value={alterDate} type="date" />
                            </div>
                            <div className="col-6">
                                <label>Hora:</label>
                                <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAlterHour(event.target.value)} className="form-control" value={alterHour} type="time" />
                            </div>
                        </div>
                        <footer className="d-flex justify-content-center">
                            <button onClick={async() => {
                                if (!(record.times.includes(alterHour) && record.times.includes(alterDate))) {
                                    await timeRecordsChange(record.id_time_records);
                                }
                                setRecord({});
                            }} type="button" className="btn btn-secondary">Alterar</button>
                        </footer>
                    </div>
                }
                <div className="d-flex align-items-center justify-content-center mt-4">
                    <button onClick={async () => {
                        await cancelTimeRecords();
                    }} title="Desconsiderar registro" className="btn btn-danger" type="button">Desconsiderar</button>
                </div>
            </div>
        </div>
    )
}