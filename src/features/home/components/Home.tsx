import { Box, Typography, Paper, Avatar } from "@mui/material";
import YitaoAvatar from '../../../assets/Yitao.png'
import JunHaoAvatar from '../../../assets/JunHao.jpeg'
import CSIcon from '../../../assets/CS-Logo.png'
import FeatureDisplay from "./FeatureDisplay";



export default function Home() {
    return (
        <Box component="section" sx={{
            display: 'flex', flexDirection: 'column', p: 2, border: '1px solid var(--border)', gap:'2rem',
            margin: '1rem 6rem', padding:'2rem', borderRadius:'1rem'
        }}>
            <img style={{ alignSelf: 'center' }} width='200' height='200' src={CSIcon} />
            <Typography sx={{ alignSelf: 'center' }} variant="h5">
                The next generation inventory management system
            </Typography>

            <FeatureDisplay />

            <Typography sx={{ alignSelf: 'center', textAlign:'center' }} variant="h6">
                Plus, so many more quality-of-life features, <br />
                guaranteed to finally end your CCA logistics hell!
            </Typography>
            
            <Box display='flex' justifyContent='center' gap='3rem'
                textAlign='center' flexWrap='wrap'>
                <Paper>
                    <Avatar src={YitaoAvatar} sx={{ width: '10rem', height: '10rem', marginBottom: '1rem', justifySelf: 'center' }}>YT</Avatar>
                    <Typography variant='h5'>
                        Ding Yitao
                    </Typography>
                    <br />
                    <Typography variant='body2' >
                        Y2 CS
                    </Typography>
                </Paper>
                <Paper>
                    <Avatar src={JunHaoAvatar} sx={{ width: '10rem', height: '10rem', marginBottom: '1rem', justifySelf: 'center' }}>JH</Avatar>
                    <Typography variant='h5'>
                        Ng Jun Hao
                    </Typography>
                    <br />
                    <Typography variant='body2'>
                        Y2 CS
                    </Typography>
                </Paper>
            </Box>
        </Box>
    )
}