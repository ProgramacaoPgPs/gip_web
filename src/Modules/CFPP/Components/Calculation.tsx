import React, { useEffect, useState } from "react";
import { convertForTable, convertTime, fetchNodeDataFull } from "../../../Util/Util";
import TableComponent from "../../../Components/CustomTable";
import ListRegister from "./ListRegister";
import { useMyContext } from "../../../Context/MainContext";
import DetailsTimeRecords from "./DetailsTimesRecords";

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