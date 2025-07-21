import Typography from "@mui/material/Typography";
import "./Sidebar.css"
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { Divider } from "@mui/material";

interface SidebarItemProps {
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string }
    open: boolean
    selected: boolean
    name: string
    navigate: () => void
}

export default function SidebarItem({ Icon, open, selected, name, navigate }: SidebarItemProps) {
    return (
        <>
            <div className={"nav-menu-item" + (open ? " active" : "") + (selected ? " selected" : "")} onClick={navigate}>
                <Icon fontSize="large" />
                <Typography>{name}</Typography>
            </div>
            <Divider sx={{ borderColor: 'var(--primary-alternative)' }} />
        </>
    )
}