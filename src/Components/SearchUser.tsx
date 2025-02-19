import React, { useEffect, useState } from "react";
import { useConnection } from "../Context/ConnContext";
import CSDS from "./CSDS";
import { useMyContext } from "../Context/MainContext";
import CustomTable from "./CustomTable";
import { tItemTable } from "../types/types";

export default function SearchUser() {
    const [page, setPage] = useState<number>(1);
    const [limitPage, setLimitPage] = useState<number>(1);
    const [params, setParams] = useState<string>('');
    const [list, setList] = useState<tItemTable[]>([]);
    const { setLoading } = useMyContext();

    const { fetchData } = useConnection();

    useEffect(() => {
        (async () => {
            await recoverList(params);
        })();
    }, [page, params]);

    useEffect(() => {
        console.log(list);
    }, [list]);


    async function recoverList(value?: string) {
        try {
            setLoading(true);
            let newUrlComplement = `&pPage=${page}`
            if (value) {
                newUrlComplement += value;
            }
            const req: any = await fetchData({ method: 'GET', params: null, pathFile: 'CCPP/Employee.php', urlComplement: newUrlComplement });
            if (req["error"]) throw new Error(req["message"]);
            console.log(req["data"]);
            setList(convertForTable(req["data"]));
            setLimitPage(req["limitPage"]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }
    function convertForTable(array: any[]): tItemTable[] {
        return array.map(element => ({
            employee_name: maskUserSeach(element["employee_name"], "Nome"),
            company_name: maskUserSeach(element["company_name"], "Companhia"),
            store_name: maskUserSeach(element["store_name"], "Loja"),
            departament_name: maskUserSeach(element["departament_name"], "Departamento"),
            sub_dep_name: maskUserSeach(element["sub_dep_name"], "Cargo"),
        }));
    }

    function maskUserSeach(value: string, tag: string): { tag: string; value: string } {
        return { tag, value };
    }

    return (
        <div className="d-flex align-items-center justify-content-center bg-white position-absolute top-0 start-0 w-100 h-100 p-2">
            <div className="d-flex flex-column justify-content-between bg-dark p-2 rounded w-100 h-75">
                <header>
                    <div>
                        <h1 className="text-white">Colaboradores:</h1>
                    </div>
                    <CSDS onAction={(e: string) => {
                        setParams(e);
                        setPage(1)
                    }} />
                </header>
                <section className="bg-white flex-grow-1 overflow-auto">
                    {/* <RenderListUser list={list} /> */}
                    <CustomTable list={list} />
                </section>
                <footer className="d-flex align-items-center justify-content-around text-white py-4">
                    <button onClick={() => navPage(false)} className="btn btn-light fa-solid fa-backward" type="button"></button>
                    {`( ${page.toString().padStart(2, '0')} / ${limitPage.toString().padStart(2, '0')} )`}
                    <button onClick={() => navPage(true)} className="btn btn-light fa-solid fa-forward" type="button"></button>
                </footer>
            </div>
        </div>
    );



    function navPage(isNext: boolean) {
        // Verifica se haverá uma adição ou subtração em relação a página atual.
        const newPage = isNext ? page + 1 : page - 1;
        //Faz o controle do limite da página.
        if (newPage <= limitPage && newPage >= 1) {
            setPage(newPage);
        }
    }
}

function RenderListUser(props: { list: any[] }) {
    return (
        <div>
            {props?.list.map((item: any) => <h1 key={`employeeData_${item.employee_id}`}>{item.employee_name}</h1>)}
        </div>
    )
}