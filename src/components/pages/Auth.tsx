import { type FormEvent, use, useEffect, useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
// import Register from './Register.tsx';
import supabase from '../../helper/supabaseClient.ts';

interface AuthProps {
    state: string
    setPageTitle: (arg0: string) => void
}

export default function Auth({ state, setPageTitle }: AuthProps) {
    let navigate = useNavigate();

    useEffect(() => {
        setPageTitle(state.charAt(0).toUpperCase() + state.slice(1, state.length))
    }, [state])

    return (state === 'login'
        ? <Login />
        : state === 'register'
            ? <Register />
            : <p>Error!</p>
    )
}

export function Login() {
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
        supabase.auth.getSession().then(session => {
            if (session.error) {
                console.log(session.error)
            } else if (!!!session.data.session) {

            } else {
                navigate('/dashboard/' + session.data.session!.user.id)
            }
        })
    }, []);

    return (<div className='auth-container'>
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

export function Register() {
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
            setMessage(error.message);
            return;
        }
        if (data.user?.identities && data.user.identities.length > 0) {
            console.log("Sign-up successful!");
            setMessage("A link was sent to your email")
        } else {
            console.log("Email address is already taken.");
            setMessage("Email address is already taken.")
        }
    }
        useEffect(() => {
            supabase.auth.getSession().then(session => session.data.session ? navigate('/dashboard/' + session.data.session.user.id) : null)
        }, []);

    

    return (<div className='auth-container'>
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