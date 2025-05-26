import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import './Dashboard.css'
import supabase from '../../../helper/supabaseClient';
import type { User } from '@supabase/auth-js';

interface DashboardProps {
    setPageTitle: (arg0: string) => void;
}


export default function Dashboard({ setPageTitle }: DashboardProps) {
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

interface OrganizationsProps {
    user: User | null
}

interface Table {
    id: string;
    organization: string | null;
}

export function Organizations({ user }: OrganizationsProps) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<Table[] | null>(null)

    useEffect(() => {
        setTimeout(async () => {

            const { data, error } = await supabase
                .from('Organizations')
                .select('*')

            console.log(error?.message)
            console.log(data)
            setLoading(false)
            setData(data)

        }, 0)
    }, [])

    return loading
        ? (<>
            <div className="organization-loading">Loading...</div>
        </>)
        : (<div className="organization-container">
            {data?.filter(index => index.organization).map((key, index) =>
                <div key={index} className="organization-component">
                    <p>{key.organization!}</p>
                    <div className="organization-component-buttons">
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                </div>)}
        </div>)
}