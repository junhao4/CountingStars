import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
    return (
        <Box sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '4rem', padding:'4rem',
            backgroundColor: 'var(--card)' ,outline: '2px solid var(--border)', borderRadius: '8px'
        }}>
            <CircularProgress color="secondary" size='6rem'/>
        </Box>
    )
}