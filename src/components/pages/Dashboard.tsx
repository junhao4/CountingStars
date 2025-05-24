import { generatePath, useNavigate, useParams } from 'react-router';
import './Dashboard.css'
import supabase from '../../helper/supabaseClient';

function Dashboard() {
    const { user } = useParams();
    const navigate = useNavigate();

    const handleLogout = () => {
        supabase.auth.signOut()
        navigate('/')
    }

    return (
    <div>
        <p>WELCOME, {user}</p>
        <button onClick={handleLogout}>Log out</button>
    </div>
)}

export default Dashboard;