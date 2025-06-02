import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
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
    const navigate = useNavigate()
    const { title, setTitle } = usePageTitleContext()
    const { session } = useSessionContext()
    // Renders the Add Organization Pop-up if true
    const [trigger, setTrigger] = useState(false)
    const [refresh, setRefresh] = useState(true)
    const [org, setOrg] = useState<OrganizationFetch | null>(null)
    const [add, setAdd] = useState(true)
    const [imgUrl, setImgUrl] = useState<string>("")

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
        
        {/* Fetches organizations from the database and displays in a grid */}
        <Organizations user={session!.user} refresh={refresh} setRefresh={setRefresh} setOrg={setOrg} setTrigger={setTrigger} setAdd={setAdd} setImgUrl={setImgUrl}/>

        {/* Displays the footer with Add Organization button that unhides pop-up */}
        <div style={{
            display: 'flex', bottom: '0', left: '0', width: '100vw',
            padding: '16px 0', justifyContent: 'space-evenly', backgroundColor: 'yellow',
            overflow: 'auto', position: 'fixed', outline:'2px solid black'
        }}>
            <Button onClick={(e) => addOrg()}
                variant='contained' sx={{color:'white', backgroundColor:'black'}}
            >Add Organization</Button>
        </div>

        {/* Show pop-up for user to submit organization details and add */}
        <AddEditOrg trigger={trigger} closePopup={() => setTrigger(false)} setRefresh={setRefresh} refresh={refresh} add={add} org={org} setAdd={setAdd} imgUrl={imgUrl}/>
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
    setImgUrl : (img : string) => void
}

function Organizations({ user, refresh, setRefresh, setOrg, setTrigger, setAdd, setImgUrl }: OrganizationsProps) {
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

    const editOrg = async (key : OrganizationFetch, imgUrl : string) => {
        setImgUrl(imgUrl)
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
            <Typography sx={{margin:'32px 0 32px 0', justifySelf:'center'}}variant='h3' component='h1'>Your Organizations</Typography>
            <Grid container padding={'8px'} spacing={2} justifyContent={'center'} overflow={'auto'} wrap='wrap' >{
                data.map((key, index) =>
                    <Card sx={{ width: 'max(25%,200px)' }} key={index}>
                        {img[index]
                            ? <CardMedia sx={{ height: '200px' }} image={img[index]} />
                            : <CardMedia />
                        }
                        <CardHeader title={key.name}></CardHeader>
                        <CardActions style={{ justifyContent: 'space-evenly' }}>
                            <button onClick={() => editOrg(key, img[index])}>Edit</button>
                            <button onClick={() => deleteOrg(key)}>Delete</button>
                        </CardActions>
                    </Card>)
            }</Grid>
            <div style={{height: '80px'}}></div>
            </>)
            : (<>No Organizations found!</>)
}
