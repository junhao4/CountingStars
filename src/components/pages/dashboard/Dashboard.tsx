import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { usePageTitleContext } from '../../contexts/PageTitleContext';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useSessionContext } from '../../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { useOrgContext } from '../../contexts/OrgContext';
import Loading from '../../general/Loading';
import { Box, Input } from '@mui/material';
import { useMessageContext } from '../../contexts/MessageContext';
import { enterOrg, fetchDashboard, joinOrg, type DashboardOrganizationFetch } from './DashboardController';
import OrgCard from './OrgCard';

export default function Dashboard() {
    const { user } = useSessionContext()!
    const [loading, setLoading] = useState(true)
    const { setTitle } = usePageTitleContext()
    const { setOrgContext } = useOrgContext()
    const { createMessage } = useMessageContext()
    const navigate = useNavigate()

    const [orgs, setOrgs] = useState<DashboardOrganizationFetch[]>([])
    const [joinId, setJoinId] = useState<string>('')

    // On render, fetch all the organizations on the dashboard, and their images
    useEffect(() => {
        setLoading(true)

        if (user) {
            new Promise(async () => {
            const data = await fetchDashboard(user)
            if (data) {
                setOrgs(data)
            } else {
                setOrgs([])
            }
            setLoading(false)
        })
        }
    }, [user])

    useEffect(() => {
        setTitle("Dashboard");
    }, [])



    const onEnterOrgClick = (index: number) => {
        // If successfully entered organization, set its context.
        if (enterOrg(orgs[index], createMessage)) {
            setOrgContext(orgs[index])
            navigate('organization')
        }
    }

    const onJoinOrgClick = async () => { 
        // If successfully joined, add new organization card to dashboard
        const res = await joinOrg(joinId, user!.user_id, createMessage) 
        if (res) {
            setOrgs([...orgs, res])
        }
    }

    // Renders loading screen. If no data, display "No organizations found", else display the organizations in Cards.
    return loading
        ? <Loading></Loading>
        : <Box sx={{
            overflow: 'auto', outline: '1px solid black', margin: '1rem 4rem',
            justifySelf: 'center', width: '70%'
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
                    <Button color='info' onClick={onJoinOrgClick}
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
                                <OrgCard key={index} org={key} index={index} onEnterOrgClick={onEnterOrgClick} />
                            )
                        })
                    }</Grid>
                : <></>}
        </Box>
}