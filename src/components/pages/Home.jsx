import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'



function Home () {
    return (<>
    
    <p>DADA</p>
    
           <nav>
            <p><Link to="/">Home</Link></p>
            <Link to="/login">
                Login<FontAwesomeIcon icon={faCoffee}/>

            </Link>
          </nav>
 
    
      
      </>);

          

}

export default Home;