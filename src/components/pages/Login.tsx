import { type FormEvent, use, useEffect, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
// import Register from './Register.tsx';
import supabase from '../../helper/supabaseClient.ts';

interface LoginProps {
    setPageTitle: (arg0: string) => void;
}

function Login({ setPageTitle }: LoginProps) {
    let navigate = useNavigate();
    const [message, setMessage] = useState<string>("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email, password
        });
        if (error) {
            setMessage(error.message);
            return;
        }
        if (data) {
            console.log(data)
            navigate('/dashboard/' + data.user.id)
        }
    }

    useEffect(() => {
        setPageTitle("Login")
        supabase.auth.getSession().then(session => 
            {
                if (session.error) {
                    console.log(session.error)
                } else if (!!!session.data.session) {

                } else {
                    navigate('/dashboard/' + session.data.session!.user.id)
                }
            })
    }, []);

    return (<div className='login-container'>
        <form id='login' onSubmit={handleLogin} className='form-container'>
            <div className='form-field'>
                <label htmlFor="email">Email:
                    <input id='email' type="text" value={email} onChange={e => setEmail(e.target.value)} /></label><br />
            </div>
            <div className='form-field'>
                <label htmlFor="password">Password:
                    <input id='password' type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
            </div>
            <div className='form-footer'>
                <button type="submit">Login</button>
            </div>
        </form>
        <p>{message}</p>
    </div>
    );
}

export default Login;