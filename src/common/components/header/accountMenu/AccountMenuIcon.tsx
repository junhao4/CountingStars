import { Box, Tooltip, IconButton, Avatar } from "@mui/material";

interface AccountMenuIconProps {
    open: boolean,
    img: string | undefined,
    handleClick: (event: React.MouseEvent<HTMLElement>) => void,
}

export default function AccountMenuIcon({ open, img, handleClick }: AccountMenuIconProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', bgcolor: 'transparent' }}>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    size="medium"
                    sx={{ mx: 0 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar src={img} sx={{ width: 40, height: 40 }} />
                </IconButton>
            </Tooltip>
        </Box>
    )
}