import { useEffect, useState } from 'react';
import { usePageTitleContext } from '../contexts/PageTitleContext';
import { Avatar, Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import supabase from '../../helper/supabaseClient';
import { useMessageContext } from '../contexts/MessageContext';


function Home() {
    const navigate = useNavigate()
    const { setTitle } = usePageTitleContext()
    const { createMessage } = useMessageContext()
    const [logo, setLogo] = useState<string>()
    const [yitaoAvatar, setYitaoAvatar] = useState<string>()

    const fetchLogo = async () => {
        const { data, error } = await supabase.storage.from('website-resources')
            .download('CS-Logo.png')
        if (error) {
            createMessage('error', "Error fetching CS logo from storage: " + error.message)
        } else {
            setLogo(URL.createObjectURL(data))
        }
    }

    const fetchYitaoAvatar = async () => {
        const { data, error } = await supabase.storage.from('website-resources')
            .download('Yitao-Avatar.png')
        if (error) {
            createMessage('error', "Error fetching Yitao's avatar from storage: " + error.message)
        } else {
            setYitaoAvatar(URL.createObjectURL(data))
        }
    }

    useEffect(() => {
        setTitle("Home")
        fetchLogo()
        fetchYitaoAvatar()
    }, [])

    return (
        <Box component="section" sx={{ display: 'flex', flexDirection: 'column', p: 2, border: '2px solid black', margin: '4rem', padding: '2rem' }}>
            <img style={{ alignSelf: 'center' }} width='30%' src={logo} />
            <Typography sx={{ alignSelf: 'center' }} variant="h4" component="h1">
                Introducing, CS!
            </Typography>
            <Typography sx={{ alignSelf: 'center', padding: '8px 0', marginTop: '1rem', marginBottom: '4rem' }} variant="h5" component="h2">
                Your go-to platform for your CCA organization needs.
            </Typography>
            <Box display='flex' justifyContent='center' gap='100px'
                textAlign='center' flexWrap='wrap'>
                <Paper>
                    <Avatar src={yitaoAvatar} sx={{ width: 150, height: 150, marginBottom: '2rem', justifySelf:'center' }}>YT</Avatar>

                    <Typography variant='h4'>
                        Ding Yitao
                    </Typography>
                    <Typography variant='h6' >
                        Y2 Computer Science
                    </Typography>
                </Paper>
                <Paper>
                    <Avatar sx={{ width: 150, height: 150, marginBottom: '2rem', justifySelf:'center' }}>JH</Avatar>
                    <Typography variant='h4'>
                        Ng Jun Hao
                    </Typography>
                    <Typography variant='h6'>
                        Y2 Computer Science
                    </Typography>
                </Paper>
            </Box>
        </Box>
    )
}

export default Home;