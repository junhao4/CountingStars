import { Box, Button, Modal, styled, Typography } from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useEffect, useState, type SetStateAction } from "react"
import supabase from '../../../helper/supabaseClient';
import { useSessionContext } from '../../contexts/SessionContext';
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

interface CreateOrgPopupProps {
    trigger: boolean,
    closePopup: () => void,
    setRefresh: React.Dispatch<SetStateAction<boolean>>
}

export default function CreateOrgPopup({ trigger, closePopup, setRefresh }: CreateOrgPopupProps) {
    const [name, setName] = useState("")
    const [img, setImg] = useState<FileList | null>(null)
    const { session } = useSessionContext()
    const { createMessage } = useMessageContext()

    const handleAddOrganization = async () => {
        // Check that image size is < 2MB, type is correct, and that organization name is not empty
        if (img && img[0].size > 2097152) {
            createMessage("failure", "Image size must be < 2MB!")
            return
        }

        if (img && !(img[0].type === 'image/jpeg' || img[0].type === 'image/png')) {
            createMessage("failure", "File type not accepted!")
            return
        }

        if (name === '') {
            createMessage("failure", "Organization name must not be empty!")
            return
        }

        // Check that organization name is unique for the user
        const { data: org } = await supabase.from('Organizations')
            .select('id')
            .eq('name', name)

        if (org?.length !== 0) {
            createMessage("failure", "You already have an organization with the same name. Please choose another name.")
            return
        }

        img?.length === 1
            ? supabase.storage.from('organization-images').upload(img[0].name, img[0], {
                cacheControl: '3600',
                upsert: false
            }).then(res => {if (res.error) {createMessage("failure", res.error.message)}})
            : null

        await supabase.from('Organizations')
            .insert({ name, image_file: img?.[0].name })
            .then(res => {if (res.error) {createMessage("failure", res.error.message)}})

        const { data, error } = await supabase.from('Organizations')
            .select('id')
            .eq('name', name)
            .single()

        if (error) {
            createMessage("failure", error.message)
        } else {
            supabase.from('users_organizations')
                .insert({ user_id: session!.user.id, organization_id: data.id, role: 'owner' })
                .then(res => {if (res.error) {createMessage("failure", res.error.message)}})
                .then(closePopup)
                .then(() => setRefresh(prev => !prev))
        }
    }

    useEffect(() => {
        setName("")
        setImg(null)
    }, [trigger])
    
    return (<>
        <Modal open={trigger}
            onClose={closePopup}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translateY(-50%) translateX(-50%)', height: '55%',
                backgroundColor: 'beige', outline: '4px solid black', padding: '16px', borderRadius: '8px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: '8px', overflow: 'auto'
            }}> <Typography variant="h4" component="h2">{'Add Organization'}</Typography>

                <Typography variant="h6" component="h2">
                    Organization Name:
                    <input id='name' type="text" value={name}
                        style={{ marginLeft: '8px', fontSize: '20px' }} onChange={e => setName(e.target.value)} />
                </Typography>

                <Typography variant="h6" component="h2">
                    Organization Logo: {'(.jpg or .png, < 2MB)'}
                </Typography>

                <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                    Upload File<VisuallyHiddenInput type='file' onChange={(e) => setImg(e.target.files)} />
                </Button>

                {
                    img?.length == 1
                        ? <p style={{ fontSize: '24px', margin: '0', alignSelf: 'center' }}>File name: {img[0].name}</p>
                        : <></>
                }

                <div style={{ display: 'flex', height: '50%', justifyContent: 'center' }}>
                    {img?.length == 1 ? <img style={{ margin: '8px' }} width='50%' src={URL.createObjectURL(img[0])} /> : <></>}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', gap: '32px' }}>
                    <Button color='primary' variant='contained'
                        onClick={e => handleAddOrganization()} size='large' loading={false}>{"Add"}</Button>
                    <Button color='error' variant='outlined'
                        onClick={e => closePopup()} size="large">Close</Button>
                </div>
            </Box>
        </Modal>
    </>
    )
}
