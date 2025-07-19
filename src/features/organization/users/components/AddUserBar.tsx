import { Box, Typography, Input, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext";
import { useState, type SetStateAction } from "react";
import { addOrganizationUser } from "../api/UserGridApi";
import { useSessionContext, type ValidSession } from "../../../../common/contexts/SessionContext";
import { useAlertContext } from "../../../../common/contexts/AlertContext";
import InfoTip from "../../../../common/components/InfoTip";

interface AddUserBarProps {
    setRefresh: React.Dispatch<SetStateAction<boolean>>
}

export default function AddUserBar({ setRefresh }: AddUserBarProps) {
    const { user } = useSessionContext() as ValidSession
    const { org } = useOrgContext() as ValidOrg
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
            sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', p: '1rem' }}
            bgcolor='transparent'>

            <div style={{display:'flex', flexWrap:'wrap', gap: '2rem'}}>
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
                <Button variant="outlined" color='secondary' onClick={onAddOrganizationUser}>
                    Add user
                </Button>
            </div>

            <InfoTip
                header={["Adding users", "Owner Role", "Admin Role", "Member Role", "Pending users"]}
                body={["Enter the user's email to add them into the organization. They must have registered.",
                    `Owners are able to do everything, including deleting the organization, and except modifying logs. 
                        There must be at least one owner per organization.`,
                    `Admins are able to edit other admins and members, and modify the inventory.`,
                    `Members only have view-only access to organization features.`,
                    `Pending users are those that applied to join the organization. Admins and above can choose to accept or reject their entry.`
                ]} />
        </Box>
    )
}