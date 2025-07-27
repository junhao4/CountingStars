import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useSessionContext, type ValidSession } from '../../../common/contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { useOrgContext, type ValidOrg } from '../../../common/contexts/OrgContext';
import Loading from '../../../common/components/Loading';
import { Box, TextField } from '@mui/material';
import { useAlertContext } from '../../../common/contexts/AlertContext';
import { type DashboardOrganizationFetch, fetchDashboard, joinOrg } from '../api/DashboardApi';
import DashboardCard from './DashboardCard';
import { hasPermission } from '../../../helper/RolePermissions';
import type { UserOrganization } from '../../../helper/types';
import InfoTip from '../../../common/components/InfoTip';

export default function Dashboard() {
    const { user } = useSessionContext() as ValidSession
    const { setOrg } = useOrgContext() as ValidOrg
    const [loading, setLoading] = useState(true)
    const { createAlert } = useAlertContext()
    const navigate = useNavigate()

    const [orgs, setOrgs] = useState<DashboardOrganizationFetch[]>([])
    const [joinId, setJoinId] = useState<string>('')


    useEffect(() => {
        setLoading(true)
        new Promise(async () => {
            const data = await fetchDashboard(user!.id)
            if (data) {
                setOrgs(data)
            } else {
                setOrgs([])
            }
            setLoading(false)
        })
    }, [user])



    const onEnterOrgClick = (index: number) => {
        // If successfully entered organization, set its context.
        const userWithOrganization = { ...user, userId: user.id, organizationId: orgs[index].id, role: orgs[index].role } as UserOrganization
        if (hasPermission(userWithOrganization, "organization", "view", orgs[index])) {
            setOrg(orgs[index])
            navigate('organization')
        } else {
            createAlert('warning', 'Your request to join this organization is still pending approval')
        }
    }

    const onJoinOrgClick = async () => {
        // If successfully joined, add new organization card to dashboard
        const res = await joinOrg(joinId, user!.id)
        if (res) {
            createAlert('success', "Successfully requested to join! Please wait for the organization's approval")
            setOrgs([...orgs, res])
        } else {
            createAlert('warning', "Already in organization, or it does not exist")
        }
    }

    if (loading) { return <Loading /> }

    // Renders loading screen. If no data, display "No organizations found", else display the organizations in Cards.
    return (<Box sx={{
        overflow: 'auto', outline: '1px solid var(--border)', borderRadius: '1rem',
        margin: '1rem 4rem',
        justifySelf: 'center', width: '70%'
    }}>

        <div style={{display: 'flex', justifyContent:'right', padding: '0 1rem'}}>
            <Box display='flex' textAlign='center' alignItems='center' justifyContent='center' width='100%'
                gap='2rem' margin='1rem' flexWrap='wrap'>
                <Typography variant='h5'>Your Organizations</Typography>

                <Button onClick={() => navigate('new')}
                    variant='outlined' sx={{ flexShrink: 0, color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                    Create Organization
                </Button>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <TextField placeholder='&ensp;Organization ID' sx={{ width: '8rem', marginLeft: '1rem' }}
                        value={joinId} onChange={(e) => setJoinId(e.target.value)} />
                    <Button color='info' onClick={onJoinOrgClick}
                        variant='outlined' sx={{ flexShrink: 0 }}>
                        Join Organization
                    </Button>
                </div>
            </Box>
            
            <InfoTip resource='dashboard' />
        </div>

        {orgs.length > 0 &&
            <Grid container padding='2rem 0' spacing={2} justifyContent='center' overflow='auto' wrap='wrap'
                boxShadow='0 -1px 0 var(--border)'>{
                    orgs.map((key, index) => {
                        return (
                            <DashboardCard key={index} org={key} index={index} onEnterOrgClick={onEnterOrgClick} />
                        )
                    })
                }</Grid>}
    </Box>)
}