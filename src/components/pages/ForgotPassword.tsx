import React, { useState, type FormEvent } from 'react'
import supabase from '../../helper/supabaseClient';
import './Auth.css';

function ForgotPassword() {

const [message, setMessage] = useState<string>("");
const [email, setEmail] = useState("");
   
 const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'http://localhost:5173/reset'})
        if (error) {
            setMessage(error.message);
            return;
        }
        if (data) {
            console.log(data)
            setMessage("A link was sent to your email")
        }
    }

  return (
     <div className='auth-container'>
        <form id='login' onSubmit={handleSubmit} className='form-container'>
            <h1 style={{textAlign: 'center', padding:0, margin:0,  lineHeight: 0}}>Reset Your Password</h1>
            <p style={{textAlign: 'center', padding:0, margin:0,  lineHeight: 0}}> 
                Type in your email and we'll send you a link to reset your password
            </p>
            <div className='form-field'>
                <label htmlFor="email">Email:
                    <input id='email' type="text" value={email} onChange={e => setEmail(e.target.value)} /></label><br />
            </div>
            <div className='form-footer'>
                <button type="submit">Submit</button>
            </div>
        </form>
        <p style={{marginLeft: 20}}>{message}</p>
    </div>
    );
}

export default ForgotPassword