import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { Menu, MenuItem, Typography, Divider, ListItemIcon } from "@mui/material";
import type { FirstTimeUser, User } from "../../../../helper/types"

interface AccountMenuDropdownProps {
    anchorEl: HTMLElement | null,
    handleClose: () => void,
    handleProfile: () => void,
    handleLogout: () => void,
    user: User | FirstTimeUser,
    open: boolean
}

export default function AccountMenuDropdown({anchorEl, handleClose, handleProfile, handleLogout, open, user}: AccountMenuDropdownProps) {
    return (<>
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
                paper: {
                    elevation: 0,
                    variant: "outlined",
                    sx: {
                        overflow: 'visible',
                        mt: 1.5,
                        padding: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem sx={{ py: 0, color: "var(--foreground-primary)", pointerEvents: 'none' }}>
                <Typography sx={{
                    fontWeight: 900, color: "var(--foreground-primary)", "&.Mui-disabled": {
                        opacity: 1
                    }
                }}>
                    {user?.name}
                </Typography>
            </MenuItem>
            <MenuItem disabled sx={{ py: 0 }}>
                <Typography >
                    {user.email}
                </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                    <Settings fontSize="small" />
                </ListItemIcon>
                Profile Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    </>)
}