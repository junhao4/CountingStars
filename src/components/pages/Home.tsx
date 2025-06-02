import { useEffect } from 'react';
import './Home.css';
import { usePageTitleContext } from '../contexts/PageTitleContext';
import { Box, Typography } from '@mui/material';


function Home() {

    //Set header title to Home
    const { title, setTitle } = usePageTitleContext();

    useEffect(() => {
        setTitle("Home");
    }, [])
    //

    return (
        <Box component="section" sx={{ p: 2, border: '2px solid black' }}>
            <Typography sx={{ justifySelf: 'center' }} variant="h4" component="h1">
                Welcome to Counting Stars, an orbital project embarked by Jun Hao and Ding Yitao!
            </Typography>
            <Typography sx={{ padding: '8px 0' }} variant="h5" component="h2">
                The website is a work in-progress.
            </Typography>
        </Box>
    )
}

export default Home;