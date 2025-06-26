import { useEffect } from 'react';
import { usePageTitleContext } from '../contexts/PageTitleContext';
import { Avatar, Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function Home() {
    const navigate = useNavigate()
    //Set header title to Home
    const { title, setTitle } = usePageTitleContext();

    useEffect(() => {
        setTitle("Home");
    }, [])

    return (
        <Box component="section" sx={{ p: 2, border: '2px solid black' }}>
            <Typography sx={{ justifySelf: 'center' }} variant="h4" component="h1">
                Welcome to Counting Stars, an orbital project embarked by Jun Hao and Ding Yitao!
            </Typography>
            <Typography sx={{ padding: '8px 0' }} variant="h5" component="h2">
                The website is a work in-progress.
            </Typography>
            <Box display='flex' flexDirection='row' justifyContent='center' gap='48px'
                textAlign='center'>
                <Paper elevation={4} sx={{ padding: '20px', backgroundColor:'secondary.light'}}>
                    <Avatar sx={{ width: 200, height: 200, marginBottom:'2rem' }}>YT</Avatar>

                    <Typography variant='h4'>
                        Ding Yitao
                    </Typography>
                    <Typography variant='h6'>
                        Y2 Computer Science
                    </Typography>
                </Paper>
                <Paper>
                    <Avatar sx={{ width: 200, height: 200 }}>JH</Avatar>
                </Paper>
            </Box>
        </Box>
    )
}

export default Home;