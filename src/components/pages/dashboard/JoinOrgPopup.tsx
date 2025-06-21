import { Box, Button, Modal, styled, Typography } from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useEffect, useState, type SetStateAction } from "react"
import supabase from '../../../helper/supabaseClient';
import { useSessionContext } from '../../contexts/SessionContext';

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

interface JoinOrgPopupProps {
    trigger: boolean,
    closePopup: () => void,
}

export default function JoinOrgPopup({ trigger, closePopup }: JoinOrgPopupProps) {
    const [text, setText] = useState<string>("")
    const { session } = useSessionContext()

    const handleStringToNumber = (text: string) => {
        var newStr = ""
        for (var i = 0; i < text.length; i++) {
            if (Number.isInteger(Number.parseInt(text.charAt(i)))) {
                newStr = newStr + text.charAt(i)
            }
        }
        setText(newStr)
    }

    const handleJoinOrganization = async () => {
        const organization_id = Number.parseInt(text)
        if (Number.isNaN(organization_id)) {
            console.log("Not a valid organization id number!")
        }
        await supabase.from("users_organizations")
            .select("")
            .eq("user_id", session!.user.id)
            .eq("organization_id", organization_id)
            .then(res => {
                if (res.error) {
                    console.log(res.error.message)
                } else if (res.data.length === 1) {
                    console.log("Error: Already in organization or still pending approval!")
                } else {
                    supabase.from("users_organizations")
                        .insert({user_id: session!.user.id, organization_id, role: "pending"})
                        .then(res => {if (res.error) {console.log(res.error.message)}})
                }
            })
    }

    useEffect(() => {
        setText("")
    }, [trigger])
    
    return (<>
        <Modal open={trigger}
            onClose={closePopup}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translateY(-50%) translateX(-50%)', height: '55%',
                backgroundColor: 'beige', outline: '4px solid black', padding: '16px', borderRadius: '8px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: '8px', overflow: 'auto'
            }}> <Typography variant="h4" component="h2">Join Organization</Typography>

                <Typography variant="h6" component="h2">
                    Organization ID:
                    <input id='name' type='text' value={text}
                        style={{ marginLeft: '8px', fontSize: '20px' }} onChange={e => handleStringToNumber(e.target.value)} />
                </Typography>

                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', gap: '32px' }}>
                    <Button color='primary' variant='contained'
                        onClick={e => handleJoinOrganization()} size='large' loading={false}>Request to Join</Button>
                    <Button color='error' variant='outlined'
                        onClick={e => closePopup()} size="large">Close</Button>
                </div>
            </Box>
        </Modal>
    </>
    )
}