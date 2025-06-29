import { useEffect, useState } from 'react';
import { usePageTitleContext } from '../contexts/PageTitleContext';
import { Avatar, Box, Paper, Typography } from '@mui/material';
import supabase from '../../helper/supabaseClient';
import { useMessageContext } from '../contexts/MessageContext';


function Home() {
    const { setTitle } = usePageTitleContext()
    const { createMessage } = useMessageContext()
    const [logo, setLogo] = useState<string>()
    const [yitaoAvatar, setYitaoAvatar] = useState<string>()
    const [jhAvatar, setJhAvatar] = useState("")

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

    const fetchJHAvatar = async () => {
        const { data, error } = await supabase.storage.from('website-resources')
            .download('Random 2.jpeg')
        if (error) {
            createMessage('error', "Error fetching JH's avatar from storage: " + error.message)
        } else {
            setJhAvatar(URL.createObjectURL(data))
        }
    }

    useEffect(() => {
        setTitle("Home")
        fetchLogo()
        fetchYitaoAvatar()
        fetchJHAvatar()
    }, [])

    return (
        <Box component="section" sx={{
            display: 'flex', flexDirection: 'column', p: 2, border: '2px solid black', margin: '2rem 8rem'
        }}>
            <img style={{ alignSelf: 'center' }} width='200' height='200' src={logo} />
            <Typography sx={{ alignSelf: 'center' }} variant="h6">
                Introducing, CS!
            </Typography>
            <Typography sx={{ alignSelf: 'center', padding: '8px 0', margin: '0 0 1rem 0' }} variant="body1">
                Your go-to platform for your CCA organization needs.
            </Typography>
            <Box display='flex' justifyContent='center' gap='3rem'
                textAlign='center' flexWrap='wrap'>
                <Paper>
                    <Avatar src={yitaoAvatar} sx={{ width: '6rem', height: '6rem', marginBottom: '1rem', justifySelf: 'center' }}>YT</Avatar>

                    <Typography variant='body1'>
                        Ding Yitao
                    </Typography>
                    <Typography variant='body2' >
                        Y2 CS
                    </Typography>
                </Paper>
                <Paper>
                    <Avatar src={jhAvatar} sx={{ width: '6rem', height: '6rem', marginBottom: '1rem', justifySelf: 'center' }}>JH</Avatar>
                    <Typography variant='body1'>
                        Ng Jun Hao
                    </Typography>
                    <Typography variant='body2'>
                        Y2 CS
                    </Typography>
                </Paper>
            </Box>
        </Box>
    )
}

export default Home;