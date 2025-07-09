import { Box, Typography, Input, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { useOrgContext } from "../../../../common/contexts/OrgContext";
import { useState, type SetStateAction } from "react";
import { addOrganizationUser } from "../api/UserGridApi";
import { useSessionContext, type ValidSession } from "../../../../common/contexts/SessionContext";
import { useAlertContext } from "../../../../common/contexts/AlertContext";

interface AddUserBarProps {
    setRefresh: React.Dispatch<SetStateAction<boolean>>
}

export default function AddUserBar({setRefresh}: AddUserBarProps) {
    const { user } = useSessionContext() as ValidSession
    const orgProps = useOrgContext().getOrgContext()!
    const { createAlert} = useAlertContext()

    const [email, setEmail] = useState<string>('')
    const [role, setRole] = useState<string>('member')

    const onAddOrganizationUser = async () => {
        const success = await addOrganizationUser(user.id, orgProps.id, email, role, createAlert)
        if (success) { setRefresh(prev => !prev) }
    }

    return (
        <Box hidden={!(orgProps.role === "owner" || orgProps.role === "admin")}
            sx={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'right', gap: '4rem', alignItems: 'center', p: '1rem' }}
            bgcolor='transparent'>
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '2rem', alignItems: 'center' }}>
                <Typography>Email: </Typography>
                <Input value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email' />
            </div>
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '2rem', alignItems: 'center' }}>
                <Typography>Role: </Typography>
                <FormControl size="small">
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
            </div>
            <Button variant="contained" color='secondary' onClick={onAddOrganizationUser}>
                Add user
            </Button>
        </Box>
    )
}