import { type FormEvent, use, useEffect, useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../../helper/supabaseClient.ts';
import { usePageTitleContext } from '../../contexts/PageTitleContext';



export function Register() {
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (email == "" || password == "") {
            setMessage("Please fill in the blanks")
            setLoading(false)
        } else {
            const { data, error } = await supabase.auth.signUp({
                email, password
            });
            if (error) {
                setMessage(error.message);
                setLoading(false)
                return;
            }
            if (data.user?.identities && data.user.identities.length > 0) {
                console.log("Sign-up successful!");
                setMessage("A link was sent to your email")
                setLoading(false)
            } else {
                console.log("Email address is already taken.");
                setMessage("Email address is already taken.")
                setLoading(false)
            }
        }
    }

    //Set header title to Register
    const { title, setTitle } = usePageTitleContext();

    useEffect(() => {
        console.log("Setting title to Register")
        setTitle("Registration");
        console.log(title)
    }, [])
    //
        

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
                <button type="submit" disabled={loading} style={ !loading ? {} :{ color: "grey" }}>Register</button>
            </div>
        </form>
        <p>{message}</p>
    </div>
    );

}