import { styled } from '@mui/material/styles';
import { Button } from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import './AddOrgPopup.css'
import { useRef, useState } from "react"
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

// ISSUE 1: VisuallyHiddenInput, after selecting a file once, and removing it, then attempting to set the same file will result in nothing happening.

export default function AddOrgPopup({ trigger, closePopup }: AddOrgPopupProps) {
    const [name, setName] = useState("")
    const [img, setImg] = useState<FileList | null>(null)
    const { session } = useSessionContext()

    const handleAddOrganization = async () => {
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

    return (
        trigger
            ? <div className='org-popup-screen'>
                <div className='org-popup-container'>
                    <div className='org-popup-name'>
                        <label htmlFor="name" style={{ fontSize: '20px' }}>Organization Name:
                            <input id='name' type="text" value={name}
                                style={{ marginLeft: '8px', fontSize: '20px' }} onChange={e => setName(e.target.value)} />
                        </label>
                    </div>
                    <div className='org-popup-img'>
                        <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                            Upload File<VisuallyHiddenInput type='file' onChange={(e) => setImg(e.target.files)} />
                        </Button>
                        {
                            img?.length == 1
                                ? <><p style={{ fontSize: '24px', margin: '0', alignSelf: 'center' }}>File name: {img[0].name}</p>
                                    <Button sx={{ left: '-8px', color: 'red', minWidth: '4px' }} size='medium' className='org-popup-img-remove-button'
                                        onClick={() => { setImg(null); }}><strong>X</strong></Button>
                                </>
                                : <></>
                        }
                    </div>
                    <div style={{ display: 'flex', height: '50%', justifyContent: 'center' }}>
                        {img?.length == 1 ? <img style={{ margin: '8px' }} width='50%' src={URL.createObjectURL(img[0])} /> : <></>}
                    </div>
                    <div className='org-footer-buttons'>
                        <Button color='primary' variant='contained'
                            onClick={e => handleAddOrganization()} size='large' loading={false}>Add</Button>
                        <Button color='error' variant='outlined'
                            onClick={e => closePopup()} size="large">Close</Button>
                    </div>
                </div>
            </div>
            : <></>
    )
}

