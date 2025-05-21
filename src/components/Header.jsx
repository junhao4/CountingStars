import React, { useState } from 'react';
import './Header.css';
import stars from '../assets/stars.jpg';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'

function Header() {
    return (
        <div className='header-container'>
            <Link to='/' className='header-logo'>Counting Stars
                <FontAwesomeIcon className='header-icon' icon={faTwitter} />
            </Link>
            <h1 className='header-title'>Login Page</h1>
        </div>
    );
}

export default Header;