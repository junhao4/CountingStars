import { type FormEvent, useEffect, useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '@supabase/auth-js';
import supabase from '../../helper/supabaseClient';

interface RegisterProps {
    setPageTitle: (arg0: string) => void;
}

function Register({ setPageTitle }: RegisterProps) {
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signUp({
            email, password
        });
        if (error) {
            console.log(error)
            setMessage(error.message);
            return;
        }
        if (data) {
            console.log(data)
            setMessage("A link has been sent to your email");
        }
    }

    useEffect(() => {
        setPageTitle("Registration")
        supabase.auth.getSession().then(session => session.data.session ? navigate('/dashboard/' + session.data.session.user.id) : null)
    }, []);

    return (<div className='register-container'>
        <form onSubmit={handleRegister} className='form-container'>
            <div className='form-field'>
                <label htmlFor="email">Email:
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} /></label><br />
            </div>
            <div className='form-field'>
                <label htmlFor="password">Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
            </div>
            <div className='form-footer'>
                <button type="submit">Register</button>
            </div>
        </form>
        <p>{message}</p>
    </div>
    );
}

export default Register;