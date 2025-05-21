import React, { FormEvent } from 'react';
import './Login.css';
import { Link } from 'react-router-dom'
import Register from './Login.jsx'

function Login() {
    /**
     * @param {FormEvent<HTMLFormElement>} e 
     */
    const handleLogin = (e) => {
        e.preventDefault();
        // Do something to login...?
    }

    return (
        <div className='login-container'>
            <form onSubmit={handleLogin} className='form-container'>
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" /><br />
                </div>
                <div>
                <label for="password">Password:</label>
                <input type="text" id="password" name="password" />
                </div>
                <div className='form-footer'>
                    <button type="submit">Login</button>
                    <Link to={Register}>Register</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;