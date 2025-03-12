import React, { useEffect, useState } from "react";
import { convertForTable, fetchNodeDataFull } from "../../../Util/Util";
import TableComponent from "../../../Components/CustomTable";

export default function Calculation({ tokenCFPP, loadTokenCFPP }: { tokenCFPP: string, loadTokenCFPP: () => Promise<void> }) {
    const [payments, setPayments] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            await loadRecordType();
        })();
    }, [tokenCFPP]);

    useEffect(() => console.log(payments), [payments]);

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

                <h1>Página para calcular a Hora!</h1>

                {payments.length > 0 &&
                    <TableComponent
                        maxSelection={1}
                        list={convertForTable(payments)}
                        onConfirmList={(items) => console.log(items)}
                        hiddenButton={true}
                    />
                }
            </div>
        </React.Fragment>
    )
}