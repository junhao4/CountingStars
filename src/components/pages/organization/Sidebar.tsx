import Box from "@mui/material/Box"
//import { useState } from "react"
import MenuIcon from '@mui/icons-material/Menu'
import { IconButton } from "@mui/material"


const drawerWidth = 240

export default function Sidebar() {
    //const [open, setOpen] = useState<boolean>(true)
    return (
        <Box display='fixed' width={drawerWidth} height='calc(100vh - 5rem)' overflow='hidden'>
            <IconButton>
                <MenuIcon />
            </IconButton>
        </Box>
    )
}