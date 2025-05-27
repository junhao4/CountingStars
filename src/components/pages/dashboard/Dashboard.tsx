import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import supabase from '../../../helper/supabaseClient';
import Button from '@mui/material/Button';
import { usePageTitleContext } from '../../contexts/PageTitleContext';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import { useSession } from '../../contexts/SessionContext';


export default function Dashboard() {
    const navigate = useNavigate();
    const { session } = useSession();

    // Shows pop-up when the button is clicked
    const handleAddOrganization = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        // TODO
    }
    
    const { title, setTitle } = usePageTitleContext();

    const handleLogout = () => {
        supabase.auth.signOut()
        navigate('/')
    }

    useEffect(() => {
        console.log("Setting title to Dashboard")
        setTitle("Dashboard");
        console.log(title)
        console.log(session)

    }, [])

    return (<>
        <div>
            <p>WELCOME, {session?.user.email}</p>
            <button onClick={handleLogout}>Log out</button>
        </div>
        <Organizations />
        <div style={{display:'flex',position:'fixed',bottom:'0',left:'0',width:'100vw',
            padding:'16px 0',justifyContent:'space-evenly',backgroundColor:'blue',
            overflow:'auto'}}>
            <Button onClick={handleAddOrganization}
                variant='contained'
                >Add Organization</Button>
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