import React, { useState } from 'react';
import './Header.css';
import stars from '../assets/stars.jpg';
import { Link } from 'react-router-dom'

function Header() {
    return (
        <div className='header-container'>
            <Link to='/' className='header-logo'>Counting Stars
            
            </Link>
            <h1 className='header-title'>Login Page</h1>
        </div>
    );
}

export default Header;