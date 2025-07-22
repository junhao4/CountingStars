import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
    return (
        <Box sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '4rem', padding:'4rem',
            outline: '4px solid black', borderRadius: '8px'
        }}>
            <CircularProgress color="secondary" size='6rem'/>
        </Box>
    )
}