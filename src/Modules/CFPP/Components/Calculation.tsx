import React, { useEffect, useState } from "react";
import { convertForTable, fetchNodeDataFull } from "../../../Util/Util";
import TableComponent from "../../../Components/CustomTable";
import DetailsTimeRecords from "./DetailsTimesRecords";
import { useCfppContext } from "../Context/CfppContex";

const customTags = {
    registration: "Matrícula",
    collaborator: "Colaborador",
    month_salary: "Sal. mensal",
    branch_desc: "Filial",
    total_hours: "H. totais",
    normal_hour: "H. normal",
    extra_hour: "H. extra",
    night_hour: "H. noturna",
    normal_payment: "H. Normal R$",
    extra_hour_payment: "H. Extra R$",
    night_bonus_payment: "Noturno R$",
    total_payment: "Total R$",
    cod_work_schedule_fk: "Cód. Jornada"
}

export default function Calculation() {
    const [payments, setPayments] = useState<any[]>([]);
    const [journeyCode, setJourneyCode] = useState<any[]>([]);
    const { tokenCFPP, loadTokenCFPP } = useCfppContext();

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
                {journeyCode.length == 1 && <DetailsTimeRecords onClose={() => { setJourneyCode([]) }} journeyCode={journeyCode[0]} />}
                {
                    journeyCode.length > 1 &&
                    <div className="d-flex align-items-center justify-content-center bg-dark bg-opacity-25 position-absolute z-1 start-0 top-0 h-100 w-100 col-12 overflow-hidden">
                        <div className="d-flex flex-column bg-white p-2 rounded col-10 h-75">
                            <h1>Deseja encerrar as marcações selecionadas? </h1>
                            <div className="flex-grow-1 overflow-auto">
                                <TableComponent
                                    hiddenButton={true}
                                    list={
                                        convertForTable(
                                            payments.filter(payment => journeyCode.includes(payment["cod_work_schedule_fk"])), {
                                            ocultColumns: ['cod_work_schedule_fk', 'month_salary', 'total_hours', 'normal_hour', 'extra_hour', 'night_hour', 'registration'],
                                            customTags
                                        })
                                    }
                                    onConfirmList={(items: any) => {
                                        if (items.length > 0) {
                                            console.log(items);
                                        }
                                    }}
                                />
                            </div>
                            <div className="d-flex justify-content-around p-2">
                                <button onClick={() => {
                                    if (window.confirm("Deseje realmente encerrar as marcações?")) console.warn("registros finalizados com sucesso")
                                }
                                } type="button" className="btn btn-success">Finalizar</button>
                                <button onClick={() => setJourneyCode([])} type="button" className="btn btn-danger">Fechar</button>
                            </div>
                        </div>
                    </div>
                }
                <h1>Página para calcular a Hora!</h1>
                <div className="my-4 h-75">
                    {payments.length > 0 &&
                        <TableComponent
                            list={convertForTable(payments, {customTags})}
                            onConfirmList={(items: any) => {
                                if (items.length > 0) {
                                    setJourneyCode(items.map((item: any) => item["cod_work_schedule_fk"]["value"]));
                                }
                            }}
                        />
                    }
                </div>
            </div>
        </React.Fragment>
    )
}