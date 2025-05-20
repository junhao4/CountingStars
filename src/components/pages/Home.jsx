import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom'

function Home () {
    return (<>
    
    <p>DADA</p>
    
           <nav>
            <p><Link to="/">Home</Link></p>
            <Link to="/login">Login</Link>
          </nav>
 
    
      
      </>);

          

}

export default Home;