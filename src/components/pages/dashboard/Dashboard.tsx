import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import supabase from '../../../helper/supabaseClient';
import { type User } from '@supabase/supabase-js'
import Button from '@mui/material/Button';
import { usePageTitleContext } from '../../contexts/PageTitleContext';
import AddOrgPopup from './AddOrgPopup';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import { useSessionContext } from '../../contexts/SessionContext';
import { CardMedia } from '@mui/material';


export default function Dashboard() {
    const navigate = useNavigate()
    const { title, setTitle } = usePageTitleContext()
    const { session } = useSessionContext()
    // Renders the Add Organization Pop-up if true
    const [trigger, setTrigger] = useState(false)
    const [refresh, setRefresh] = useState(true)
    const [org, setOrg] = useState<OrganizationFetch | null>(null)
    const [add, setAdd] = useState(true)

    // Logs user out and navigate to home page
    const handleLogout = () => {
        supabase.auth.signOut()
        navigate('/')
    }

    // When the Add button is clicked
    const addOrg = () => {
        setAdd(true)
        setOrg(null)
        setTrigger(true)
    }

    // On mount, set header title to 'Dashboard'
    useEffect(() => {
        setTitle("Dashboard");
    }, [])

    // Session and User is not null due to AuthWrapper authentication
    return (<>
        <div>
            <p>WELCOME, {session!.user.email}</p>
            <button onClick={handleLogout}>Log out</button>
        </div>

        {/* Fetches organizations from the database and displays in a grid */}
        <Organizations user={session!.user} refresh={refresh} setRefresh={setRefresh} setOrg={setOrg} setTrigger={setTrigger} setAdd={setAdd}/>

        {/* Displays the footer with Add Organization button that unhides pop-up */}
        <div style={{
            display: 'flex', bottom: '0', left: '0', width: '100vw',
            padding: '16px 0', justifyContent: 'space-evenly', backgroundColor: 'blue',
            overflow: 'auto', position: 'fixed'
        }}>
            <Button onClick={(e) => addOrg()}
                variant='contained'
            >Add Organization</Button>
        </div>

        {/* Show pop-up for user to submit organization details and add */}
        <AddOrgPopup trigger={trigger} closePopup={() => setTrigger(false)} setRefresh={setRefresh} refresh={refresh} add={add} org={org} setAdd={setAdd}/>
    </>
    )
}

export interface OrganizationFetch {
    name: string
    image: string
    id: number
}

interface OrganizationsProps {
    user : User
    refresh: boolean
    setRefresh : (refresh : boolean) => void
    setOrg: (org : OrganizationFetch) => void
    setTrigger: (trigger : boolean) => void
    setAdd: (add : boolean) => void
}

function Organizations({ user, refresh, setRefresh, setOrg, setTrigger, setAdd }: OrganizationsProps) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<OrganizationFetch[]>([])
    const [img, setImg] = useState<(string)[]>([])


    // On render, fetch organization ids
    useEffect(() => {
        setData([]);
        setImg([]);
        setLoading(true);
        new Promise<OrganizationFetch>(async () => {
            // Retrieves an array of organization ids
            const { data, error } = await supabase
                .from('users_organizations')
                .select('organization_id')
                .eq('user_id', user.id)
                .then(response => {
                    response.error
                        ? console.log(response.error.message)
                        : console.log(response.data)
                    return response;
                })

            if (!data || data.length == 0) {
                setLoading(false)
                return
            }

            // Maps organization ids to their names and image file
            data?.map(async d => {
                const images: string[] = await supabase
                    .from('Organizations')
                    .select('name, image_file, id')
                    .eq('id', d.organization_id)
                    .then(response => {
                        response.error
                            ? console.log(response.error.message)
                            : response.data.forEach(f => { setData(prev => [...prev, { name: f.name, image: f.image_file || '', id: f.id }]) })
                        return response.data
                            ? response.data.map(f => f.image_file || '')
                            : []
                    })

                // Takes the array of image files and generates ObjectURLs
                Promise.all(images.map(d => {
                    return d !== ''
                        ? supabase.storage.from('organization-images').download(d).then(i => {
                            i.data
                                ? setImg(prev => [...prev, URL.createObjectURL(i.data)])
                                : (setImg(prev => [...prev, '']), console.log(i.error))
                            return i
                        })
                        : supabase.storage.from('organization-images').download('Stock Background.jpg').then(i => {
                            i.data
                                ? setImg(prev => [...prev, URL.createObjectURL(i.data)])
                                : (setImg(prev => [...prev, '']), console.log(i.error))
                            return i
                        })
                })
                ).then(success => {
                    setLoading(false)
                })
            })
        })
    }, [refresh])

    const deleteOrg = async (key : OrganizationFetch) => {
        const confirm = window.confirm("Are you sure you want to delete? This action is permanent!")
        if (!confirm) {
            return
        }
        const { data, error } = await supabase
            .from("Organizations")
            .delete()
            .eq("id", key.id)

        if (error) {
            console.log("error deleting: ", error)
        } else {
            console.log("deleted" , key.id)
            setRefresh(!refresh)
        }
    }

    const editOrg = async (key : OrganizationFetch) => {
        setOrg(key)
        setAdd(false)
        setTrigger(true)
    }

    // Renders loading screen. If no data, display "No organizations found", else display the organizations in Cards.
    // Note: In production, components are rendered twice due to StrictMode enabled
    return loading
        ? (<>
            <div className="organization-loading">Loading...</div>
        </>)
        : data.length > 0
            ? (
                <>
            <Grid container padding={'2px'} spacing={2} justifyContent={'center'} overflow={'auto'} wrap='wrap' >{
                data.map((key, index) =>
                    <Card sx={{ width: 'max(25%,200px)' }} key={index}>
                        {img[index]
                            ? <CardMedia sx={{ height: '200px' }} image={img[index]} />
                            : <CardMedia />
                        }
                        <CardHeader title={key.name}></CardHeader>
                        <CardActions style={{ justifyContent: 'space-evenly' }}>
                            <button onClick={() => editOrg(key)}>Edit</button>
                            <button onClick={() => deleteOrg(key)}>Delete</button>
                        </CardActions>
                    </Card>)
            }</Grid>
            <div style={{height: '80px'}}></div>
            </>)
            : (<>No Organizations found!</>)
}
