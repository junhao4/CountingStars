import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import supabase from '../../../helper/supabaseClient';
import type { User } from '@supabase/auth-js';
import { usePageTitleContext } from '../../PageTitleContext';
import Button from '../../Button';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';

interface DashboardProps {
    setPageTitle: (arg0: string) => void;
}


export default function Dashboard({ setPageTitle }: DashboardProps) {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const { title, setTitle } = usePageTitleContext();

    const handleLogout = () => {
        supabase.auth.signOut()
        navigate('/')
    }

    useEffect(() => {
        console.log("Setting title to Dashboard")
        setTitle("Dashboard");
        console.log(title)
        supabase.auth.getUser().then(response => {
            if (response.error) {
                console.log(response.error)
                alert("Session does not exist or is expired!")
                navigate('/')
            } else {
                console.log(response.data.user)
                console.log(response.data.user.id)
            }
        })
    }, [])

    return (<>
        <div>
            <p>WELCOME, {user?.id}</p>
            <button onClick={handleLogout}>Log out</button>
        </div>
        <Organizations />
        <div>
            <Button onClick={e => { e.preventDefault(); }}>Add Organization</Button>
            <Button onClick={e => { e.preventDefault(); }}>Delete Organization</Button>
        </div>
    </>
    )
}

interface Table {
    id: string;
    organization: string | null;
}

export function Organizations() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<Table[] | null>(null)

    useEffect(() => {
        supabase
            .from('Organizations')
            .select('*')
            .then(response => {
                response.error
                    ? console.log(response.error.message)
                    : setData(response.data)
                setLoading(false)
                setData(response.data)
            })
    }, [])

    return loading
        ? (<>
            <div className="organization-loading">Loading...</div>
        </>)
        : (<Grid container spacing={2} justifyContent={'center'}>{
                data?.filter(index => index.organization).map((key, index) =>
                    <Card key={index}>
                        <CardHeader title={key.organization}></CardHeader>
                        <CardActions style={{justifyContent:'space-evenly'}}>
                            <button>Edit</button>
                            <button>Delete</button>
                        </CardActions>
                    </Card>)
            }</Grid>)
}