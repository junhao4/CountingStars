import React, { useEffect, useState } from 'react';
import './Header.css';
import stars from '../assets/stars.jpg';
import noUser from '../assets/no_user.jpg';
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import supabase from '../helper/supabaseClient';

interface HeaderProps {
    pageTitle: string;
}

function Header({ pageTitle }: HeaderProps) {
    const navigate = useNavigate()
    const [email, setEmail] = useState<string | undefined>("")

    useEffect(() => {
        supabase.auth.getSession().then(session => {
            if (session.error) {

            } else if (!!!session.data.session) {

            } else {
                setEmail(session.data.session!.user.email || undefined)
            }
        })
    }, [])

    const handleUserLogout = () => {
        supabase.auth.signOut()
        setEmail(undefined)
        navigate('/')
    }

    return (
        <div className='header-container'>
            <Link to='/' className='header-logo'>Counting Stars
                <img className='header-icon' width="50" height="50" src={stars}></img>
            </Link>
            <h1 className='header-title'>{pageTitle + " Page"}</h1>
            <div className='header-user-details'>
                {email
                    ? <div>
                        <p>Welcome, {email}</p>
                        <button onClick={handleUserLogout}>Log out</button>
                    </div>
                    : <><Link to='/login'>Login</Link><Link to='/register'>Register</Link></>}
            </div>
        </div>
    );
}

export default Header;