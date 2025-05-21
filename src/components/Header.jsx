import React, { useState } from 'react';
import './Header.css';
import stars from '../assets/stars.jpg';

function Header() {
    
    return (
        <div className='header'>
            <img src={stars} alt='Stars  b ' width="100" height="100"></img>
            <h1>HELLO</h1>
        </div>
    );
}

export default Header;