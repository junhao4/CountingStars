import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import supabase from "../../../../helper/supabaseClient";
import { useOrgContext } from "../../../contexts/OrgContext";

interface AddUserPopupProps {
    trigger: boolean,
    closePopup: () => void,
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
}
export default function AddUserPopup({ trigger, closePopup, setRefresh }: AddUserPopupProps) {
    const { getOrgContext } = useOrgContext()
    const orgProps = getOrgContext()
    const [email, setEmail] = useState<string>('')
    const [role, setRole] = useState<string>('member')

    const handleSubmit = async () => {
        const { data, error } = await supabase.from('Users')
            .select('user_id')
            .eq('email', email)
            .maybeSingle()

        if (error) {
            console.log(error.message)
            return
        }

        if (data) {
            const { error } = await supabase.from('users_organizations')
                .insert({ user_id: data.user_id, organization_id: orgProps!.id, role })

            if (error) {
                console.log(error)
            }

            setRefresh(prev => !prev)
        } else {
            console.log('Email not found - Please ensure they have signed up')
        }
    }

    return (
        <Modal open={trigger} onClose={closePopup}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translateY(-50%) translateX(-50%)', height: '55%',
                backgroundColor: 'beige', outline: '4px solid black', padding: '16px', borderRadius: '8px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: '8px', overflow: 'auto'
            }}>
                <Typography variant="h4" component="h2">Add User</Typography>
                <TextField id='email' label='Email' type='text' value={email} onChange={
                    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(e.target.value)} />
                <FormControl fullWidth>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                        labelId="role-select-label"
                        id="role-select"
                        value={role}
                        label="Role"
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value={'owner'}>Owner</MenuItem>
                        <MenuItem value={'admin'}>Admin</MenuItem>
                        <MenuItem value={'member'}>Member</MenuItem>
                    </Select>
                </FormControl>
                <Button variant='contained' onClick={handleSubmit} children='Submit' />
            </Box>
        </Modal>
    )
}