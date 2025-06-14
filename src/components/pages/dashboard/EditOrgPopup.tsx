import { Box, Button, Modal, Typography } from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useEffect, useState } from "react"
import supabase from '../../../helper/supabaseClient';
import type { OrganizationFetch } from './Dashboard';
import type { AddEditOrgProps } from './AddEditOrg';
import { VisuallyHiddenInput } from './AddEditOrg';

export default function EditOrgPopup({ trigger, closePopup, setRefresh, org, setAdd, imgUrl }: AddEditOrgProps) {
    const [name, setName] = useState("")
    const [img, setImg] = useState<FileList | null>(null)

    const handleEditOrganization = async (key: OrganizationFetch) => {
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

        // Check that organization name is unique for the user
        const { data: org } = await supabase.from('Organizations')
            .select('id')
            .eq('name', name)
        console.log(org);
        if (key.name !== name && org?.length !== 0) {
            alert("You already have an organization with the same name. Please choose another name.")
            return
        }

        if (img?.length === 1) {
            if (key.imageName) supabase.storage.from('organization-images')
                .remove([key.imageName])
                .then(res => { if (res.error) console.log(res.error.message); })

            supabase.storage.from('organization-images')
                .upload(img[0].name, img[0], {
                    cacheControl: '3600',
                    upsert: false
                })
                .then(res => console.log(res.error?.message))
        }

        await supabase.from('Organizations')
            .update({ name, image_file: img?.[0].name })
            .eq("id", key.id)
            .then(res => console.log(res.error))
            .then(() => setAdd(true))
            .then(closePopup)
            .then(() => setRefresh(prev => !prev))

    }

    useEffect(() => {
        setName(org?.name || "")
        setImg(null)



    }, [trigger])
    // Sets name popup field to organization name in Edit mode

    return (<>
        <Modal open={trigger}
            onClose={closePopup}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translateY(-50%) translateX(-50%)', height: '55%',
                backgroundColor: 'beige', outline: '4px solid black', padding: '16px', borderRadius: '8px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: '8px', overflow: 'auto'
            }}> <Typography variant="h4" component="h2">{'Editing ' + org?.name}</Typography>

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
                    {img?.length == 1
                        ? <img style={{ margin: '8px' }} width='60%' src={URL.createObjectURL(img[0])} />
                        : <><img style={{ margin: '8px' }} width='60%' src={imgUrl} /></>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', gap: '32px' }}>
                    <Button color='primary' variant='contained'
                        onClick={e => handleEditOrganization(org!)} size='large' loading={false}>{"Edit"}</Button>
                    <Button color='error' variant='outlined'
                        onClick={e => closePopup()} size="large">Close</Button>
                </div>
            </Box>
        </Modal>
    </>
    )
}
