import { Button, Input, styled, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../helper/supabaseClient";
import { useSessionContext } from "../../contexts/SessionContext";
import { useMessageContext } from "../../contexts/MessageContext";

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

export default function CreateOrg() {
    const navigate = useNavigate()
    const { session } = useSessionContext()!
    const { createMessage } = useMessageContext()
    const [image, setImage] = useState<FileList | null>(null)
    const [name, setName] = useState<string>("")

    const handleAddOrganization = async () => {
        // Check that image size is < 2MB, type is correct, and that organization name is not empty
        if (image && image[0].size > 2097152) {
            createMessage("error", "Image size must be < 2MB!")
            return
        }

        if (image && !(image[0].type === 'image/jpeg' || image[0].type === 'image/png')) {
            createMessage("error", "File type not accepted!")
            return
        }

        if (name === '') {
            createMessage("error", "Organization name must not be empty!")
            return
        }

        // Check that organization name is unique for the user
        const { data: org } = await supabase.from('Organizations')
            .select('id')
            .eq('name', name)

        if (org?.length !== 0) {
            createMessage("error", "You already have an organization with the same name. Please choose another name.")
            return
        }

        image?.length === 1
            ? supabase.storage.from('organization-images').upload(image[0].name, image[0], {
                cacheControl: '3600',
                upsert: false
            }).then(res => { if (res.error) { createMessage("error", res.error.message) } })
            : null

        await supabase.from('Organizations')
            .insert({ name, image_file: image?.[0].name })
            .then(res => { if (res.error) { createMessage("error", res.error.message) } })

        const { data, error } = await supabase.from('Organizations')
            .select('id')
            .eq('name', name)
            .single()

        if (error) {
            createMessage("error", error.message)
        } else {
            supabase.from('users_organizations')
                .insert({ user_id: session!.user.id, organization_id: data.id, role: 'owner' })
                .then(res => { if (res.error) { createMessage("error", res.error.message) } })
                .then(() => navigate('/dashboard'))
        }
    }

    return (
        <Box display={"flex"} flexDirection='column' sx={{
            outline: '2px solid black', width: '30rem', borderRadius: '0.25rem', justifySelf: 'center', margin:'1rem'
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
                <Button variant='contained' color='info' sx={{ margin: '1rem' }} onClick={handleAddOrganization}>Add Organization</Button>
            </div>
        </Box>)
}


