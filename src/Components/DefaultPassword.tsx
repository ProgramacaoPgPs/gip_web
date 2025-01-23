import React, { useState } from "react";
import { formChangePassword } from "../Configs/DefaultPassword";
import CustomForm from "./CustomForm";
import { useMyContext } from "../Context/MainContext";
import { Connection } from "../Connection/Connection";

export default function DefaultPassword(props: {
    open: boolean,
    user: {
        login: string
        password: string
    },
    onClose:()=>void
}): JSX.Element {
    const [password, setPassword] = useState<string>("");
    const [confirm, setConfirm] = useState<string>("");

    const { setLoading } = useMyContext();
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            setLoading(true);
            event.preventDefault();
            if (password !== confirm) throw new Error("As senhas não conferem");
            const connection = new Connection("15",true);
            const req:any = await connection.put({ user: props.user.login, password: props.user.password, new_password:password, confirm_password:confirm}, "CCPP/Login.php");
            if(req.error) throw new Error(req.message);
            alert("Senha alterada com sucesso!");
            props.onClose();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };
    return props.open ? (
        <div onClick={()=>props.onClose()} className='d-flex  align-items-center justify-content-center bg-black bg-opacity-25 position-absolute h-100 w-100 top-0'>
            <div className='d-flex flex-column bg-white col-8 col-sm-6 col-md-4 col-lg-3  py-4 rounded'>
                <header className='d-flex aligm-itens-center justify-content-center my-4  w-100'>
                    <h1>Hora de trocar sua senha!</h1>
                </header>
                <CustomForm
                    classButton='btn btn-success'
                    onSubmit={handleSubmit}
                    titleButton={"Confirmar"}
                    className='d-flex flex-column align-items-center justify-content-center h-100'
                    fieldsets={
                        formChangePassword(
                            (e: any) => setPassword(e.target.value),
                            (e: any) => setConfirm(e.target.value),
                            password,
                            confirm
                        )
                    }
                />
            </div>
        </div>
    ) : <React.Fragment />;
}