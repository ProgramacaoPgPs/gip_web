import React from 'react';
import CustomForm from './CustomForm';
import { useMyContext } from '../Context/MainContext';
import User from '../Class/User';
import { Connection } from '../Connection/Connection';
import { useNavigate } from 'react-router-dom';


function Login() {
    const navigate = useNavigate();
    const { setIsLogged, setLoading, setModal, setMessage,setTitleHead } = useMyContext();

    React.useEffect(()=>{
        setTitleHead({title:'Gestão Integrada Peg Pese - GIPP',icon:''});
    },[]);
    const fieldsetsData = [
        {
            attributes: { id: 'personal-info', className: 'row  col-8 my-2', },
            item: {
                label: 'Login',
                mandatory: true,
                captureValue: {
                    type: 'text',
                    placeholder: 'Usuário',
                    name: 'login',
                    className: 'form-control',
                    required: true,
                    id: 'loginUserInput'
                },
            },
            legend: {
                text: 'Bem vindo(a)!',
                style: 'my-2 h5 d-flex aligm-items-center justify-content-center'
            }
        },
        {
            attributes: { id: 'contact-info', className: 'row col-8 my-2' },
            item: {
                label: 'Senha',
                mandatory: true,
                captureValue: {
                    type: 'password',
                    placeholder: '******',
                    name: 'senha',
                    className: 'form-control',
                    required: true,
                    id: 'passwordUserInput'
                },
            },
        }
    ];

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        login();
    };

    return (
        <div className='d-flex flex-column align-items-center justify-content-center  h-100 w-100'>
            <CustomForm
                fieldsets={fieldsetsData}
                onSubmit={handleSubmit}
                method="post"
                className='d-flex flex-column align-items-center justify-center col-8 col-sm-6 col-md-4 col-lg-2 rounded py-4'
                id='loginCustomForm'
            />
        </div>
    );

    async function login() {
        setLoading(true);
        try {
            const user = new User({
                login: (document.getElementById('loginUserInput') as HTMLInputElement).value,
                password: (document.getElementById('passwordUserInput') as HTMLInputElement).value
            });

            const conn = new Connection('18', true);
            let req: any = await conn.post({ user: user.getLogin(), password: user.getPassword() }, "CCPP/Login.php");

            if (!req) throw new Error('No response from server');
            if (req.error) throw new Error(req.message);
            setIsLogged(true);
            navigate('/home');
        } catch (error: any) {
            setModal(true);
            setMessage({text:error.message,type:2});
        }
        setLoading(false);
    }
}

export default Login;
