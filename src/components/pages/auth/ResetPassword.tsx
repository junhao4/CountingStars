import React, { useState, type FormEvent } from 'react'
import supabase from '../../../helper/supabaseClient';

function ResetPassword() {

const [message, setMessage] = useState<string>("");
const [password, setPassword] = useState("");
   
 const handleReset = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {data, error} = await supabase.auth.updateUser({password})
        console.log(data)
        if (error) {
                setMessage(error.message);
                return;
            } else {
        
            console.log("Sign-up successful!");
            setMessage("Password reset was successful")
            }
                
    }

  return (
     <div className='auth-container'>
        <form id='login' onSubmit={handleReset} className='form-container'>
          <h1 style={{textAlign: 'center', padding:0, margin:0, display: 'inline-block', lineHeight: 0}}>Reset Your Password</h1>
            <p style={{textAlign: 'center', padding:0, margin:0, display: 'inline-block', lineHeight: 0}}> 
                Type in a new secure password and press submit to update your password
            </p>
            <div className='form-field'>
              
                <label htmlFor="password">Password:
                    <input id='password' type="password" value={password} onChange={e => setPassword(e.target.value)} /></label><br />
            </div>
            <div className='form-footer'>
                <button type="submit">Submit</button>
            </div>
        </form>
        <p style={{marginLeft: 20}}>{message}</p>
    </div>
    );
}

export default ResetPassword;