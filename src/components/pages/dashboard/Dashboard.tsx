import { useEffect, useState, type SetStateAction } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useOrgContext, type UserRoles } from '../../contexts/OrgContext';
import Loading from '../../general/Loading';
import { Box, Tab, Tabs, TextField } from '@mui/material';
import CreateOrgPopup from './CreateOrgPopup';
import EditOrgPopup from './EditOrgPopup';
import JoinOrgPopup from './JoinOrgPopup';

export interface DashboardOrgFetch {
    id: number
    name: string
    role: UserRoles
    imageName: string | null
    imageUrlBlob: string | null
}

export default function Dashboard() {
    const { setTitle } = usePageTitleContext()
    const { session } = useSessionContext()

    // Renders the Add Organization Pop-up if true
    const [refresh, setRefresh] = useState(true)

    // On mount, set header title to 'Dashboard'
    useEffect(() => {
        setTitle("Dashboard");
    }, [])

    // Session and User is not null due to AuthWrapper authentication
    return (<>
        {/* Fetches organizations from the database and displays in a grid */}
        <Organizations user={session!.user} refresh={refresh} setRefresh={setRefresh} />

        {/* Displays the footer with Add Organization button that unhides pop-up */}
        <DashboardFooter setRefresh={setRefresh} />
    </>
    )
}

interface OrganizationsProps {
    user: User
    refresh: boolean
    setRefresh: React.Dispatch<SetStateAction<boolean>>
}

function Organizations({ user, refresh, setRefresh }: OrganizationsProps) {
    const [loading, setLoading] = useState(true)
    const [trigger, setTrigger] = useState<boolean>(false)
    const [org, setOrg] = useState<DashboardOrgFetch | null>(null)
    const [orgs, setOrgs] = useState<DashboardOrgFetch[]>([])
    const [imgUrl, setImgUrl] = useState<string>("")
    const { setOrgContext } = useOrgContext()
    const navigate = useNavigate()

    // On render, fetch organization ids
    useEffect(() => {
        fetchData()
    }, [refresh])

    // Fetch organizational data
    const fetchData = async () => {
        setOrgs(() => [])
        supabase.from('users_organizations')
            .select(`organization_id, role`)
            .eq('user_id', user.id)
            .then(async response => {
                if (response.error) {
                    console.log(response.error.message)
                    return false
                } else if (!response.data || response.data.length === 0) {
                    console.log('No data found!')
                    return false
                }

                return Promise.all(response.data.map(async d => {
                    return await supabase.from('Organizations')
                        .select(`id, name, image_file`)
                        .eq('id', d.organization_id)
                        .single()
                        .then(async response => {
                            if (response.error) {
                                console.log(response.error.message)
                                return null
                            }
                            const data = { ...response.data, role: d.role }
                            const image = await fetchImage(data.image_file)
                            const result = {
                                id: data.id, name: data.name, role: data.role as UserRoles, imageName: data.image_file, imageUrlBlob: image
                            }
                            return result
                        })
                }))
            }).then(data => {
                if (data) {
                    setOrgs(data.filter(d => !!d))
                }
                setLoading(false)
            })
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

    const deleteOrg = async (key: DashboardOrgFetch) => {
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
            setRefresh(prev => !prev)
        }
    }

    const enterOrg = (index: number) => {
        setOrgContext(orgs[index])
        navigate('organization')
    }

    const editOrg = async (key: DashboardOrgFetch) => {
        setImgUrl(key.imageUrlBlob || 'No Image Found!')
        setOrg(key)
        setTrigger(true)
    }

    // Renders loading screen. If no data, display "No organizations found", else display the organizations in Cards.
    return loading
        ? <Loading></Loading>
        : orgs.length > 0
            ? (
                <Box sx={{overflow: 'auto', marginBottom:'100px'}}>
                    <Typography sx={{ margin: '32px 0 32px 0', justifySelf: 'center' }} variant='h3' component='h1'>Your Organizations</Typography>
                    <Grid container padding='8px' spacing={2} justifyContent='center' overflow='auto' wrap='wrap' >{
                        orgs.map((key, index) => {
                            return (<Card sx={{ width: 'max(25%,200px)' }} key={index}>
                                {orgs[index].imageUrlBlob
                                    ? <CardMedia sx={{ height: '200px' }} image={orgs[index].imageUrlBlob} />
                                    : <CardMedia />
                                }
                                <CardHeader sx={{textAlign:'center'}} title={key.name}></CardHeader>
                                <CardActions style={{ justifyContent: 'space-evenly' }}>
                                    <Button variant='contained' onClick={() => enterOrg(index)}>Enter</Button>
                                    <Button variant='contained' onClick={() => editOrg(key)}>Edit</Button>
                                </CardActions>
                            </Card>)
                        })
                    }</Grid>

                    <EditOrgPopup trigger={trigger} closePopup={() => setTrigger(false)} setRefresh={setRefresh} org={org}
                        imgUrl={imgUrl}
                    />
                </Box>)
            : (<>No Organizations found!</>)
}

interface DashboardFooterProps {
    setRefresh: React.Dispatch<SetStateAction<boolean>>,
}

function DashboardFooter({ setRefresh }: DashboardFooterProps) {
    // When the Create button is clicked
    const [createTrigger, setCreateTrigger] = useState<boolean>(false)
    const createOrg = () => {
        setCreateTrigger(true)
    }

    // When the Join button is clicked
    const [joinTrigger, setJoinTrigger] = useState<boolean>(false)
    const requestJoinOrg = async () => {
        setJoinTrigger(true)
    }

    return (
        <>
            <Box sx={{
                display: 'flex', bottom: '0', left: '0', width: '100vw',
                padding: '16px 0', justifyContent: 'center', gap:'20%', backgroundColor: 'yellow',
                overflow: 'auto', position: 'fixed', outline: '2px solid black'
            }}>
                <Button onClick={(e) => setCreateTrigger(true)}
                    variant='contained'>
                    Create Organization
                </Button>

                <Button onClick={() => setJoinTrigger(true)}
                    variant='contained'>
                    Join Organization
                </Button>
            </Box>

            {/* Show pop-up for user to submit organization details and add */}
            <CreateOrgPopup trigger={createTrigger} closePopup={() => setCreateTrigger(false)}
                setRefresh={setRefresh} />

            <JoinOrgPopup trigger={joinTrigger} closePopup={() => setJoinTrigger(false)} />
        </>
    )
}