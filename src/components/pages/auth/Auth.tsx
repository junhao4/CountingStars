import { type FormEvent, use, useEffect, useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionContext } from '../../contexts/SessionContext.tsx';
import { Login } from './Login.tsx';
import { Register } from './Register.tsx';

export interface AuthProps {
    state: string
}

export default function Auth({ state }: AuthProps) {
    let navigate = useNavigate();
    const { session } = useSessionContext();

    useEffect(() => {
        if (session) {
            navigate('/dashboard')
        }
    }, [])

    

    return (state === 'login'
        ? <Login />
        : state === 'register'
            ? <Register />
            : <p>Error!</p>
    )
}



