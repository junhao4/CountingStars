import React, { useState } from 'react';
import './Header.css';
import stars from '../assets/stars.jpg';
import noUser from '../assets/no_user.jpg';
import { Link } from 'react-router-dom'
import type { Auth, User } from 'firebase/auth';

interface HeaderProps {
    auth: Auth;
    user: User | null;
    pageTitle: string;
    handleUserLogout: () => void;
}

function Header({ auth, user, pageTitle, handleUserLogout }: HeaderProps) {
    return (
        <div className='header-container'>
            <Link to='/' className='header-logo'>Counting Stars
                <img className='header-icon' width="50" height="50" src={stars}></img>
            </Link>
            <h1 className='header-title'>{pageTitle + " Page"}</h1>
            <div className='header-user-details'>
                {user
                ? user.photoURL
                    ? <img src={user.photoURL} width='50' height='50'></img>
                    : <><img src={noUser} alt='No User Image Default' width='50' height='50' />
                        <div>
                            <p>Welcome, {user.email}</p>
                            <button onClick={handleUserLogout}>Log out</button>
                        </div>

                      </>
                : <><Link to='/login'>Login</Link><Link to='/register'>Register</Link></>}
            </div>
        </div>
    );
}

export default Header;