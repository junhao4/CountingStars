import { Box } from "@mui/material";
import GoogleDriveIcon from '../../../assets/Google_Drive_icon_.png'
import LogsIcon from "../../../assets/Logs.png"
import ChartsIcon from "../../../assets/Charts.png"


export default function FeatureDisplay() {


    return (
        <>
            <Box display='flex' gap='1rem' justifyContent='space-evenly' 
                alignItems='center' textAlign='center' bgcolor='var(--card)' p='1.5rem' borderRadius='10rem'>
                <img width={'100px'} src={GoogleDriveIcon} />
                <h2>Folder System inspired by Google Drive</h2>
            </Box>

            <Box display='flex' gap='1rem' justifyContent='space-evenly' 
                alignItems='center' textAlign='center' bgcolor='var(--card)' p='1.5rem' borderRadius='10rem'>
                <h2>Logs keeps track of all changes - <br />
                    Never worry about lost data!</h2>
                <img width={'100px'} src={LogsIcon} />
            </Box>

            <Box display='flex' gap='1rem' justifyContent='space-evenly' 
                alignItems='center' textAlign='center' bgcolor='var(--card)' p='1.5rem' borderRadius='10rem'>
                <img width={'100px'} src={ChartsIcon} />
                <h2>Easily view and compare statistics <br />
                    over time on selected items!</h2>
            </Box>
        </>
    )
}