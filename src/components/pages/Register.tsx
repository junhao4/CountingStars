import { type FormEvent, useEffect, useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/auth-js';
import supabase from '../../helper/supabaseClient';

interface RegisterProps {
    setPageTitle: (arg0: string) => void;
}

function Register({ setPageTitle }: RegisterProps) {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signUp({
            email, password
        });
        if (error) {
            setMessage(error.message);
            return;
        }
        if (data) {
            setAuthenticated(true);
        }
    }

    useEffect(() => {
        setPageTitle("Registration")
        supabase.auth.getSession().then(session => {setAuthenticated(!!session.data);setUser(session.data.session?.user || null);})
    }, []);

    return (
        authenticated
        ? <div><p>WELCOME, {user?.email}</p><button onClick={undefined}>Log out</button></div>
        : <div className='register-container'>
            <form onSubmit={handleRegister} className='form-container'>
                <div className='form-field'>
                    <label htmlFor="email">Email:</label>
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
                </div>
                <div className='form-field'>
                <label htmlFor="password">Password:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='form-footer'>
                    <button type="submit">Register</button>
                </div>
            </form> 
        </div>
    );
}

export default Register;