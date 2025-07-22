import { Box, Typography, Input, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext";
import { useState, type SetStateAction } from "react";
import { addOrganizationUser } from "../api/UserGridApi";
import { useSessionContext, type ValidSession } from "../../../../common/contexts/SessionContext";
import { useAlertContext } from "../../../../common/contexts/AlertContext";
import { hasPermission } from "../../../../helper/RolePermissions";

interface AddUserBarProps {
    setRefresh: React.Dispatch<SetStateAction<boolean>>
}

export default function AddUserBar({ setRefresh }: AddUserBarProps) {
    const { user } = useSessionContext() as ValidSession
    const { org } = useOrgContext() as ValidOrg
    const userWithOrg = { userId: user.id, organizationId: org.id, role: org.role }
    const { createAlert } = useAlertContext()

    const [email, setEmail] = useState<string>('')
    const [role, setRole] = useState<string>('member')

    const onAddOrganizationUser = async () => {
        const success = await addOrganizationUser(user.id, org.id, email, role, createAlert)
        if (success) {
            setRefresh(prev => !prev)
            createAlert('success', "Successfully added user to organization!")
        }
    }

    return (
        <Box hidden={!(org.role === "owner" || org.role === "admin")}
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
                        <MenuItem disabled={!hasPermission(userWithOrg, "users", "addUser",
                            { ...userWithOrg, role: 'owner', countOfOwners: 0 })} value={'owner'}>Owner</MenuItem>
                        <MenuItem disabled={!hasPermission(userWithOrg, "users", "addUser",
                            { ...userWithOrg, role: 'admin', countOfOwners: 0 })} value={'admin'}>Admin</MenuItem>
                        <MenuItem disabled={!hasPermission(userWithOrg, "users", "addUser",
                            { ...userWithOrg, role: 'member', countOfOwners: 0 })} value={'member'}>Member</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <Button variant="contained" color='secondary'
                disabled={!hasPermission(userWithOrg, "users", "addUser",
                    { ...userWithOrg, role: 'member', countOfOwners: 0 })} value={'member'}
                onClick={onAddOrganizationUser}>
                Add user
            </Button>
        </Box>
    )
}