import { Box, Modal, Typography } from "@mui/material";

export default function Loading() {
    return (
        <Modal open>
            <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translateY(-50%) translateX(-50%)',
                padding:'64px', outline:'4px solid black', borderRadius:'8px'}}>
                <Typography>Loading...</Typography>
            </Box>
        </Modal>
    )
}