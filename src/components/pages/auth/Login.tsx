import { type FormEvent, use, useEffect, useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../../helper/supabaseClient.ts';
import { usePageTitleContext } from '../../contexts/PageTitleContext.tsx';
import type { User } from '@supabase/supabase-js';
import { useSessionContext } from '../../contexts/SessionContext.tsx';


export function Login() {
    let navigate = useNavigate();
    const { session } = useSessionContext()
    const { setTitle } = usePageTitleContext();
    const [message, setMessage] = useState<string>("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleFirstTimeUser = async (user: User) => {
        const { data, error } = await supabase
            .from('Users')
            .select()
            .eq('user_id', user!.id)

        if (data!.length > 0) {
            console.log("user exists", data)
        } else {
            const { data, error } = await supabase
                .from('Users')
                .insert({ user_id: user?.id, name: null, image_file: 'Default_pfp.jpg', user_email: user?.email })
                .select()

            if (data) {
                console.log("User successfully added")
            } else {
                console.log(error.message)
            }
        }

    }

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email, password
        });
        if (error) {
            setMessage(error.message);
            setPassword("")
            return;
        }
        if (data) {
            console.log(data)
            await handleFirstTimeUser(data.user)
            console.log("Going to dashboard")
            navigate('/dashboard')
        }
    }

    useEffect(() => {
        setTitle("Login");
    }, [])

    useEffect(() => {
        if (session) {
            navigate('/dashboard')
        }
    }, [session])

    return (
        <div className='auth-container'>
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ marginLeft: 20, marginBottom: 0, marginTop: 0 }}>
                        {message}
                    </p>
                    <Link to='/forgot' style={{ color: 'grey', textAlign: 'right', marginTop: 0, marginBottom: 0, marginRight: 80 }} >Forgot Password?</Link>

                </div>
            </form>

        </div>
    );
}