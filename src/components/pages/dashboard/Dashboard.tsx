import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import supabase from '../../../helper/supabaseClient';
import { type User } from '@supabase/supabase-js'
import Button from '@mui/material/Button';
import { usePageTitleContext } from '../../contexts/PageTitleContext';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import { useSession } from '../../contexts/SessionContext';
import { CardMedia } from '@mui/material';


export default function Dashboard() {
    const navigate = useNavigate();
    const { title, setTitle } = usePageTitleContext();
    const { session } = useSession();

    // Shows pop-up when the button is clicked
    const handleAddOrganization = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        // TODO
    }

    // Logs user out and navigate to home page
    const handleLogout = () => {
        supabase.auth.signOut()
        navigate('/')
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
        <Organizations user={session!.user} />
        <div style={{
            display: 'flex', position: 'fixed', bottom: '0', left: '0', width: '100vw',
            padding: '16px 0', justifyContent: 'space-evenly', backgroundColor: 'blue',
            overflow: 'auto'
        }}>
            <Button onClick={handleAddOrganization}
                variant='contained'
            >Add Organization</Button>
        </div>
    </>
    )
}

interface OrganizationFetch {
    name: string
    image: string
}

export function Organizations({ user }: { user: User }) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<OrganizationFetch[]>([])
    const [img, setImg] = useState<(string)[]>([])

    // On render, fetch organization ids
    useEffect(() => {
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
            
            if (data?.length == 0) {
                setLoading(false)
                return
            }


            // Maps organization ids to their names and image file
            data?.map(async d => {
                const images: string[] = await supabase
                    .from('Organizations')
                    .select('name, image_file')
                    .eq('id', d.organization_id)
                    .then(response => {
                        response.error
                            ? console.log(response.error.message)
                            : response.data.forEach(f => { setData(prev => [...prev, { name: f.name, image: f.image_file || '' }]) })
                        return response.data
                            ? response.data.map(f => f.image_file||'')
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
            })})
            // return () => URL.revokeObjectURL(img)
        }, [])

        // Renders loading screen. If no data, display "No organizations found", else display the organizations in Cards.
        // Note: In production, components are rendered twice due to StrictMode enabled
        return loading
            ? (<>
                <div className="organization-loading">Loading...</div>
            </>)
            : data.length > 0
                ? (<Grid container spacing={2} justifyContent={'center'} overflow={'auto'} wrap='wrap' >{
                    data.map((key, index) =>
                        <Card sx={{ width: 'max(25%,200px)' }} key={index}>
                            {img[index]
                                ? <CardMedia sx={{ height: '200px' }} image={img[index]} />
                                : <CardMedia />
                            }
                            <CardHeader title={key.name}></CardHeader>
                            <CardActions style={{ justifyContent: 'space-evenly' }}>
                                <button>Edit</button>
                                <button>Delete</button>
                            </CardActions>
                        </Card>)
                }</Grid>)
                : (<>No Organizations found!</>)
    }