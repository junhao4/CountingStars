import { useEffect, useState } from 'react';
import supabase from '../../../helper/supabaseClient';
import { type User } from '@supabase/supabase-js'
import Button from '@mui/material/Button';
import { usePageTitleContext } from '../../contexts/PageTitleContext';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useSessionContext } from '../../contexts/SessionContext';
import AddEditOrg from './AddEditOrg';


export default function Dashboard() {
    const { setTitle } = usePageTitleContext()
    const { session } = useSessionContext()
    // Renders the Add Organization Pop-up if true
    const [trigger, setTrigger] = useState(false)
    const [refresh, setRefresh] = useState(true)
    const [org, setOrg] = useState<OrganizationFetch | null>(null)
    const [add, setAdd] = useState(true)
    const [imgUrl, setImgUrl] = useState<string>("")

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

        {/* Fetches organizations from the database and displays in a grid */}
        <Organizations user={session!.user} refresh={refresh} setRefresh={setRefresh} setOrg={setOrg} setTrigger={setTrigger} setAdd={setAdd} setImgUrl={setImgUrl} />

        {/* Displays the footer with Add Organization button that unhides pop-up */}
        <div style={{
            display: 'flex', bottom: '0', left: '0', width: '100vw',
            padding: '16px 0', justifyContent: 'space-evenly', backgroundColor: 'yellow',
            overflow: 'auto', position: 'fixed', outline: '2px solid black'
        }}>
            <Button onClick={(e) => addOrg()}
                variant='contained' sx={{ color: 'white', backgroundColor: 'black' }}
            >Add Organization</Button>
        </div>

        {/* Show pop-up for user to submit organization details and add */}
        <AddEditOrg trigger={trigger} closePopup={() => setTrigger(false)} setRefresh={setRefresh} refresh={refresh} add={add} org={org} setAdd={setAdd} imgUrl={imgUrl} />
    </>
    )
}

export interface OrganizationFetch {
    id: number
    name: string
    imageName: string | null
    imageUrlBlob: string | null
}

interface OrganizationsProps {
    user: User
    refresh: boolean
    setRefresh: (refresh: boolean) => void
    setOrg: (org: OrganizationFetch) => void
    setTrigger: (trigger: boolean) => void
    setAdd: (add: boolean) => void
    setImgUrl: (img: string) => void
}

function Organizations({ user, refresh, setRefresh, setOrg, setTrigger, setAdd, setImgUrl }: OrganizationsProps) {
    const [loading, setLoading] = useState(true)
    const [orgs, setOrgs] = useState<OrganizationFetch[]>([])

    // On render, fetch organization ids
    useEffect(() => {
        setOrgs([]);
        setLoading(true);

        fetchData()

    }, [refresh])

    // Fetch organizational data
    const fetchData = async () => {
            supabase
                .from('Users')
                .select(`user_id, name,
                            Organizations (id, name, image_file)`)
                .eq('user_id', user.id)
                .then(response => {
                    if (response.error) {
                        console.log(response.error.message)
                    } else if (response.data.length === 0) {
                        console.log('No data found!')
                    }
                    console.log(response.data)
                    return response.data
                })
                .then(data => {
                    data![0].Organizations.map(async org => {
                        const image = await fetchImage(org.image_file)
                        const result = {
                            id: org.id, name: org.name, imageName: org.image_file, imageUrlBlob: image
                        }
                        console.log(image)
                        setOrgs(prev => [...prev, result])
                    })
                })
            setLoading(false)
        }

    // After retrieving organization data, this function is called to retrieve the image blob and returns an URL to it.
    const fetchImage = async (name: string | null) => {
        if (name === null) {
            name = 'Stock Background.jpg'
        }
        const { data, error } = await supabase.storage.from('organization-images')
            .download(name)
        if (error) {
            console.log(error.message)
            return null
        }
        return URL.createObjectURL(data)
    }

    const deleteOrg = async (key: OrganizationFetch) => {
        const confirm = window.confirm("Are you sure you want to delete? This action is permanent!")
        if (!confirm) {
            return
        }

        if (key.imageName) supabase.storage.from('organization-images')
                .remove([key.imageName])
                .then(res => { if (res.error) console.log(res.error.message); })
                    
        const { data, error } = await supabase
            .from("Organizations")
            .delete()
            .eq("id", key.id)

        if (error) {
            console.log("error deleting: ", error)
        } else {
            console.log("deleted", key.id)
            setRefresh(!refresh)
        }
    }

    const editOrg = async (key: OrganizationFetch) => {
        setImgUrl(key.imageUrlBlob || 'No Image Found!')
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
        : orgs.length > 0
            ? (
                <>
                    <Typography sx={{ margin: '32px 0 32px 0', justifySelf: 'center' }} variant='h3' component='h1'>Your Organizations</Typography>
                    <Grid container padding={'8px'} spacing={2} justifyContent={'center'} overflow={'auto'} wrap='wrap' >{
                        orgs.map((key, index) =>
                            <Card sx={{ width: 'max(25%,200px)' }} key={index}>
                                {orgs[index].imageUrlBlob
                                    ? <CardMedia sx={{ height: '200px' }} image={orgs[index].imageUrlBlob} />
                                    : <CardMedia />
                                }
                                <CardHeader title={key.name}></CardHeader>
                                <CardActions style={{ justifyContent: 'space-evenly' }}>
                                    <button onClick={() => editOrg(key)}>Edit</button>
                                    <button onClick={() => deleteOrg(key)}>Delete</button>
                                </CardActions>
                            </Card>)
                    }</Grid>
                    <div style={{ height: '80px' }}></div>
                </>)
            : (<>No Organizations found!</>)
}
