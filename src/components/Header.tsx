import './Header.css';
import stars from '../assets/stars.jpg';
import { Link, useNavigate } from 'react-router-dom'
import supabase from '../helper/supabaseClient';
import { usePageTitleContext } from './contexts/PageTitleContext';
import { useSession } from './contexts/SessionContext';


function Header() {
    const { session, loading } = useSession();
    const navigate = useNavigate()

    const handleUserLogout = () => {
        supabase.auth.signOut()
        navigate('/')
    }

    return (
        <div className='header-container'>
            <Link to='/' className='header-logo'>Counting Stars
                <img className='header-icon' width="50" height="50" src={stars}></img>
            </Link>
            <h1 className='header-title'>{usePageTitleContext().title + " Page"}</h1>
            <div className='header-user-details'>
                {session
                    ? <div>
                        <p>Welcome, {session.user.email}</p>
                        <button onClick={handleUserLogout}>Log out</button>
                    </div>
                    : <><Link to='/login'>Login</Link><Link to='/register'>Register</Link></>}
            </div>
        </div>
    );
}

export default Header;