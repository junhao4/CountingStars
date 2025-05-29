import { styled } from '@mui/material/styles';
import { Box, Button, Modal, Typography } from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useState } from "react"
import supabase from '../../../helper/supabaseClient';
import { useSessionContext } from '../../contexts/SessionContext';

interface AddOrgPopupProps {
    trigger: boolean
    closePopup: () => void
}

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
});

export default function AddOrgPopup({ trigger, closePopup }: AddOrgPopupProps) {
    const [name, setName] = useState("")
    const [img, setImg] = useState<FileList | null>(null)
    const { session } = useSessionContext()

    const handleAddOrganization = async () => {
        // Check that image size is < 2MB, type is correct, and that organization name is not empty
        if (img && img[0].size > 2097152) {
            alert("Image size must be < 2MB!")
            return
        }

        if (img && !(img[0].type === 'image/jpeg' || img[0].type === 'image/png')) {
            alert("File type not accepted!")
            return
        }

        if (name === '') {
            alert("Organization name must not be empty!")
            return
        }

        const img_name = img?.length == 1 ? img[0].name : undefined

        img?.length == 1
            ? supabase.storage.from('organization-images').upload('' + img_name!, img[0], {
                cacheControl: '3600',
                upsert: false
            }).then(res => console.log(res.error?.message))
            : null

        await supabase.from('Organizations')
            .insert({ name, image_file: img_name })
            .then(res => console.log(res.error))

        const { data, error } = await supabase.from('Organizations')
            .select('id')
            .eq('name', name)

        if (error) {
            console.log(error.message)
        } else {
            supabase.from('users_organizations')
                .insert({ user_id: session!.user.id, organization_id: data[0].id, access_level: 'owner' })
                .then(res => console.log(res.error?.message))
        }
    }
    return (<>
        <Modal open={trigger}
            onClose={closePopup}>
            <Box sx={{ position:'absolute', top:'50%', left:'50%', transform:'translateY(-50%) translateX(-50%)', height:'50%',
                backgroundColor: 'beige', outline: '4px solid black', padding: '16px', borderRadius:'8px', 
                display:'flex', flexDirection:'column',justifyContent:'space-evenly',gap:'8px',overflow:'auto'
            }}>
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
                        onClick={e => handleAddOrganization()} size='large' loading={false}>Add</Button>
                    <Button color='error' variant='outlined'
                        onClick={e => closePopup()} size="large">Close</Button>
                </div>
            </Box>
        </Modal>
    </>
    )
}