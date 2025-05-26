import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import './Dashboard.css'
import supabase from '../../../helper/supabaseClient';
import type { User } from '@supabase/auth-js';
import Organizations from './Organizations';

interface DashboardProps {
    setPageTitle: (arg0: string) => void;
}


function Dashboard({ setPageTitle }: DashboardProps) {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    const handleLogout = () => {
        supabase.auth.signOut()
        navigate('/')
    }

    useEffect(() => {
        setPageTitle("Dashboard")
        supabase.auth.getUser().then(response => {
            if (response.error) {
                console.log(response.error)
                alert("Session does not exist or is expired!")
                navigate('/')
            } else {
                if (userId === response.data.user.id) {
                    setUser(user);
                } else {
                    console.log(userId)
                    console.log(response.data.user.id)
                    console.log('User ID does not match URL link!')
                    alert('User ID does not match URL link!')
                    navigate('/')
                }
            }
        })
    }, [])

    return (<>
        <div>
            <p>WELCOME, {userId}</p>
            <button onClick={handleLogout}>Log out</button>
        </div>
        <Organizations user={user}/>
    </>
    )
}

export default Dashboard;