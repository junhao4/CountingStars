import { useEffect, useState } from 'react';
import supabase from '../../../helper/supabaseClient';
import Button from '@mui/material/Button';
import { usePageTitleContext } from '../../contexts/PageTitleContext';
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useSessionContext } from '../../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { useOrgContext, type UserRoles } from '../../contexts/OrgContext';
import Loading from '../../general/Loading';
import { Box, CardContent, Input } from '@mui/material';
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
    const [refresh] = useState(true)
    
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
                    console.log('error', response.error.message)
                    //createMessage('error', response.error.message)
                    return false
                } else if (!response.data || response.data.length === 0) {
                    return false
                }

                return Promise.all(response.data.map(async d => {
                    return await supabase.from('Organizations')
                        .select(`id, name, image_file`)
                        .eq('id', d.organization_id)
                        .single()
                        .then(async response => {
                            if (response.error) {
                                createMessage('error', response.error.message)
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
            createMessage('error', error.message)
            return null
        }
        return URL.createObjectURL(data)
    }


    const enterOrg = (index: number) => {
        if (orgs[index].role == 'pending') {
            createMessage('error', 'Your request to join this organization is still pending approval')
            setOrgContext(null)
            return
        }
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
                        .then(res => { if (res.error) { createMessage('error', res.error.message) }
                    fetchData() })
                }
            })
    }

    // Renders loading screen. If no data, display "No organizations found", else display the organizations in Cards.
    return loading
        ? <Loading></Loading>
        : <Box sx={{ overflow: 'auto', outline: '1px solid black', margin: '1rem 4rem',
                    justifySelf:'center', width:'70%'
                 }}>

                    <Box display='flex' textAlign='center' alignItems='center' justifyContent='center' 
                        gap='2rem' margin='1rem' flexWrap='wrap'>
                        <Typography variant='h5'>Your Organizations</Typography>

                        <Button color='secondary' onClick={() => navigate('new')}
                            variant='outlined' sx={{ flexShrink: 0 }}>
                            Create Organization
                        </Button>

                        <div style={{ display: 'flex', gap: '1rem', outline: '1px solid black' }}>
                            <Input placeholder='Organization ID' disableUnderline sx={{ width: '8rem', marginLeft: '1rem' }}
                                value={joinId} onChange={(e) => setJoinId(e.target.value)} />
                            <Button color='info' onClick={joinOrg}
                                variant='outlined' sx={{ flexShrink: 0 }}>
                                Join Organization
                            </Button>
                        </div>
                    </Box>

                    {orgs.length > 0
                    ?
                    <Grid container padding='2rem 0' spacing={2} justifyContent='center' overflow='auto' wrap='wrap' 
                        boxShadow='0 -1px 0 #000'>{
                        orgs.map((key, index) => {
                            return (
                            <Card sx={{ width: 'max(10%,200px)' }} key={index}>
                                {orgs[index].imageUrlBlob
                                    ? <CardMedia sx={{ height: '150px' }} image={orgs[index].imageUrlBlob} />
                                    : <CardMedia />
                                }
                                <CardContent sx={{ textAlign: 'center'}}>
                                    <Typography variant='h6' sx={{overflow:'hidden', textOverflow:'ellipsis'}}>{key.name}</Typography>
                                </CardContent>
                                <CardActions style={{ justifyContent: 'space-evenly' }}>
                                    <Button variant='outlined' onClick={() => enterOrg(index)}>Enter</Button>
                                </CardActions>
                            </Card>)
                        })
                    }</Grid>
                    : <></> }
                </Box>
}