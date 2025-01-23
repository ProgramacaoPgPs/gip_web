import React, { useState } from 'react';
import CustomForm from './CustomForm';
import { useMyContext } from '../Context/MainContext';
import User from '../Class/User';
import { Connection } from '../Connection/Connection';
import { useNavigate } from 'react-router-dom';
import { fieldsetsData } from '../Configs/LoginConfigs';
import DefaultPassword from './DefaultPassword';

function Login() {
    const [defaultPassword, setDefaulPassword] = useState<boolean>(false);
    const [user, setUser] = useState<{
        login: string
        password: string
    }>({ login: '', password: '' });

    const navigate = useNavigate();
    const { setIsLogged, setLoading, setModal, setMessage, setTitleHead, setUserLog } = useMyContext();

    React.useEffect(() => {
        setTitleHead({ title: 'Gestão Integrada Peg Pese - GIPP', icon: '' });
        setIsLogged(false);
    }, []);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        login();
    };

    return (
        <div className='d-flex flex-column align-items-center justify-content-center h-100 w-100'>
            <DefaultPassword user={user} open={defaultPassword} onClose={()=> setDefaulPassword(false)}/>
            <CustomForm
                fieldsets={fieldsetsData}
                onSubmit={handleSubmit}
                method="post"
                className='d-flex flex-column align-items-center justify-content-center col-8 col-sm-6 col-md-4 col-lg-3 col-xl-2 rounded py-4'
                id='loginCustomForm'
            />
        </div>
    );

    async function login() {
        setLoading(true);
        try {
            const userLogin = {
                login: (document.getElementById('loginUserInput') as HTMLInputElement).value,
                password: (document.getElementById('passwordUserInput') as HTMLInputElement).value
            };
            setUser(userLogin);

            const conn = new Connection('18', true);
            let req: any = await conn.post({ user: userLogin.login, password: userLogin.password }, "CCPP/Login.php");

            if (!req) throw new Error('No response from server');
            if (req.error) throw new Error(req.message);

            setUserLog(new User({
                id: req.data.id,
                session: req.data.session,
                administrator: req.data.administrator
            }));
            localStorage.setItem("tokenGIPP", req.data.session);
            localStorage.setItem("codUserGIPP", req.data.id);

            setIsLogged(true);
            navigate('/home');
        } catch (error: any) {
            if (error.message.toLowerCase().includes('default password is not permited')) {
                alert("Você será redirecionado para trocar a senha");
                setDefaulPassword(true);
            } else {
                setModal(true);
                setMessage({ text: error.message, type: 2 });
            }
        }
        setLoading(false);
    }
}

export default Login;
