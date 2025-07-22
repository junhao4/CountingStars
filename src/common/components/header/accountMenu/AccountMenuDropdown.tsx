import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import {
    Menu,
    MenuItem,
    Typography,
    Divider,
    ListItemIcon,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
} from "@mui/material";
import type { FirstTimeUser, User } from "../../../../helper/types";
import type { ThemeMode } from "../../../contexts/ThemeContext";
import { useState } from "react";

interface AccountMenuDropdownProps {
    anchorEl: HTMLElement | null;
    handleClose: (arg0: boolean) => void;
    handleProfile: () => void;
    handleLogout: () => void;
    user: User | FirstTimeUser;
    open: boolean;
    themeMode: ThemeMode;
    setAndSaveThemeMode: (themeMode: string) => void;
}

export default function AccountMenuDropdown({
    anchorEl,
    handleClose,
    handleProfile,
    handleLogout,
    open,
    user,
    themeMode,
    setAndSaveThemeMode,
}: AccountMenuDropdownProps) {
    const [closebutton, setCloseButton] = useState(true);
    return (
        <>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={() => handleClose(true)}
                onClick={() => handleClose(closebutton)}
                slotProps={{
                    paper: {
                        elevation: 0,
                        variant: "outlined",
                        sx: {
                            overflow: "visible",
                            mt: 1.5,
                            padding: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem
                    sx={{
                        py: 0,
                        pointerEvents: "none",
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 900,
                            "&.Mui-disabled": {
                                opacity: 1,
                            },
                        }}
                    >
                        {user?.name}
                    </Typography>
                </MenuItem>
                <MenuItem disabled sx={{ py: 0 }}>
                    <Typography>{user.email}</Typography>
                </MenuItem>
                <Divider sx={{ mb: 0 }} />
                <Box
                    sx={{ px: 2, py: 1, bgcolor: "var(--card)" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mt: 0, pt: 0 }}
                    >
                        Theme
                    </Typography>
                    <RadioGroup
                        value={themeMode}
                        onChange={(e) => {
                            setCloseButton(false);
                            setAndSaveThemeMode(e.target.value as ThemeMode);
                        }}
                        name="theme"
                    >
                        <FormControlLabel
                            value="light"
                            control={
                                <Radio
                                    size="small"
                                    sx={{
                                        "&.Mui-checked": {
                                            color: "var(--text)",
                                        },
                                    }}
                                />
                            }
                            label="Light"
                        />
                        <FormControlLabel
                            value="dark"
                            control={
                                <Radio
                                    size="small"
                                    sx={{
                                        "&.Mui-checked": {
                                            color: "var(--text)",
                                        },
                                    }}
                                />
                            }
                            label="Dark"
                        />
                        <FormControlLabel
                            value="system"
                            control={
                                <Radio
                                    size="small"
                                    sx={{
                                        "&.Mui-checked": {
                                            color: "var(--text)",
                                        },
                                    }}
                                />
                            }
                            label="System"
                        />
                        <FormControlLabel
                            value="custom"
                            control={
                                <Radio
                                    size="small"
                                    sx={{
                                        "&.Mui-checked": {
                                            color: "var(--text)",
                                        },
                                    }}
                                />
                            }
                            label="Custom"
                        />
                    </RadioGroup>
                </Box>

                <Divider />
                <MenuItem
                    onClick={() => {
                        setCloseButton(false);
                        handleProfile();
                    }}
                >
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
        </>
    );
}
