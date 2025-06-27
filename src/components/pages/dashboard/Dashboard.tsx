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
import { Box, FormControl, Input, InputLabel, Tab, Tabs, TextField } from '@mui/material';
import { useMessageContext } from '../../contexts/MessageContext';

export interface DashboardOrgFetch {
    id: number
    name: string
    role: UserRoles
    imageName: string | null
    imageUrlBlob: string | null
}

export default function Dashboard() {
    const { session } = useSessionContext()!
    const [loading, setLoading] = useState(true)
    const { setTitle } = usePageTitleContext()

    // Renders the Add Organization Pop-up if true
    const [refresh, setRefresh] = useState(true)
    
    const [orgs, setOrgs] = useState<DashboardOrgFetch[]>([])
    const { setOrgContext } = useOrgContext()
    const { createMessage } = useMessageContext()
    const navigate = useNavigate()

    // On render, fetch organization ids
    useEffect(() => {
        fetchData()
    }, [refresh])

    useEffect(() => {
        setTitle("Dashboard");
    }, [])

    // Fetch organizational data
    const fetchData = async () => {
        setOrgs(() => [])
        supabase.from('users_organizations')
            .select(`organization_id, role`)
            .eq('user_id', session!.user.id)
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


    const [joinId, setJoinId] = useState<string>('')
    const joinOrg = async () => {
        var isNumber = true
        for (var i = 0; i < joinId.length; i++) {
            if (!(joinId.charAt(i) >= '0' && joinId.charAt(i) <= '9')) {
                isNumber = false
            }
        }
        if (!isNumber || joinId === '') {
            createMessage("warning", "Not a valid organization id number!")
            return
        }
        const organization_id = Number.parseInt(joinId)
        await supabase.from("users_organizations")
            .select("")
            .eq("user_id", session!.user.id)
            .eq("organization_id", organization_id)
            .then(res => {
                if (res.error) {
                    createMessage('error', res.error.message)
                } else if (res.data.length === 1) {
                    createMessage('error', "Error: Already in organization or still pending approval!")
                } else {
                    supabase.from("users_organizations")
                        .insert({ user_id: session!.user.id, organization_id, role: "pending" })
                        .then(res => { if (res.error) { createMessage('error', res.error.message) } })
                }
            })
    }

    // Renders loading screen. If no data, display "No organizations found", else display the organizations in Cards.
    return loading
        ? <Loading></Loading>
        : orgs.length > 0
            ? (
                <Box sx={{ overflow: 'auto', outline: '2px solid black', margin: '2rem' }}>

                    <Box display='flex' textAlign='center' alignItems='center' justifyContent='center' gap='2rem' margin='2rem 0 2rem 0' flexWrap='wrap'>
                        <Typography variant='h4'>Your Organizations</Typography>

                        <Button onClick={(e) => navigate('new')}
                            variant='outlined' sx={{ flexShrink: 0 }}>
                            Create Organization
                        </Button>

                        <div style={{ display: 'flex', gap: '1rem', outline: '1px solid black' }}>
                            <Input placeholder='Organization ID' disableUnderline sx={{ width: '8rem', marginLeft: '1rem' }}
                                value={joinId} onChange={(e) => setJoinId(e.target.value)} />
                            <Button onClick={joinOrg}
                                variant='outlined' sx={{ flexShrink: 0 }}>
                                Join Organization
                            </Button>
                        </div>
                    </Box>

                    <Grid container padding='2rem' spacing={2} justifyContent='center' overflow='auto' wrap='wrap' 
                        boxShadow='0 -2px 0 #000'>{
                        orgs.map((key, index) => {
                            return (
                            <Card sx={{ width: 'max(25%,200px)' }} key={index}>
                                {orgs[index].imageUrlBlob
                                    ? <CardMedia sx={{ height: '200px' }} image={orgs[index].imageUrlBlob} />
                                    : <CardMedia />
                                }
                                <CardHeader sx={{ textAlign: 'center' }} title={key.name}></CardHeader>
                                <CardActions style={{ justifyContent: 'space-evenly' }}>
                                    <Button variant='outlined' onClick={() => enterOrg(index)}>Enter</Button>
                                </CardActions>
                            </Card>)
                        })
                    }</Grid>
                </Box>)
            : (<>No Organizations found!</>)
}