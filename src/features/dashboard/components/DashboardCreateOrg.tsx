import { Box, Typography, Input, Button, styled } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAlertContext } from "../../../common/contexts/AlertContext"
import { useSessionContext, type ValidSession } from "../../../common/contexts/SessionContext"
import { handleAddOrganization } from "../api/DashboardApi"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

export default function DashboardCreateOrg() {
    const navigate = useNavigate()
    const { user } = useSessionContext() as ValidSession
    const { createAlert } = useAlertContext()
    const [image, setImage] = useState<FileList | null>(null)
    const [name, setName] = useState<string>("")

    const onHandleAddOrganization = () => {
        handleAddOrganization(user.id, name, image, createAlert).then(res => {
            if (res?.success) {
                navigate(-1)
            }
        })
    }

    return (
        <Box display={"flex"} flexDirection='column' sx={{
            outline: '2px solid black', width: '30rem', borderRadius: '0.25rem', justifySelf: 'center', margin: '1rem'
        }}>
            <Typography variant='h6' sx={{ padding: '1rem' }}>Create a new organization</Typography>

            <div style={{ display: 'flex', padding: '1rem', boxShadow: '0 -1px 0 #000' }}>
                <Typography variant='body1'>Organization Name</Typography>
                <Input sx={{ marginLeft: '3rem', width: '50%', outline: '2px solid black', borderRadius: '0.25rem', padding: '0 1rem' }} disableUnderline
                    value={name} onChange={(e) => setName(e.target.value)}></Input>
            </div>

            <div style={{ display: 'flex', padding: '1rem', boxShadow: '0 -1px 0 #000' }}>
                <Typography variant='body1'>Upload image</Typography>
                <Button sx={{ marginLeft: '5.5rem' }} component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                    Upload File<VisuallyHiddenInput type='file' onChange={(e) => setImage(e.target.files)} />
                </Button>
            </div>

            <div style={{ display: 'flex', margin: '1rem', width: '200px', height: '200px', outline: '2px solid black', alignSelf: 'center' }}>
                {image && image[0] ? <img src={URL.createObjectURL(image[0])} width='200px' height='200px'></img>
                    : <Typography sx={{ alignSelf: 'center', margin: 'auto' }}>Preview</Typography>
                }
            </div>

            <div style={{
                display: 'flex', justifyContent: 'right', alignItems: 'start',
                boxShadow: '0 -1px 0 #000'
            }}>
                <Button variant='contained' color='warning' onClick={() => navigate('/dashboard')} sx={{ margin: '1rem 0' }}>Cancel</Button>
                <Button variant='contained' color='info' sx={{ margin: '1rem' }} onClick={onHandleAddOrganization}>Add Organization</Button>
            </div>
        </Box>)
}