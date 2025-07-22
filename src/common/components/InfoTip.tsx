import { Divider, IconButton, Popover, Stack } from "@mui/material"
import { useRef, useState } from "react"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface InfoTipProps {
    resource: InfoTipTypes
}

export default function InfoTip({ resource }: InfoTipProps) {
    const [page, setPage] = useState(0)
    const [open, setOpen] = useState(false)

    const ref = useRef(null)

    return (
        <>
            <IconButton ref={ref}
                onClick={() => setOpen(prev => !prev)}><HelpOutlineIcon /></IconButton>

            <Popover open={open} anchorEl={ref.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                onClose={() => setOpen(false)}
                disableRestoreFocus>
                <Stack width={"16rem"} height={"12rem"} >
                    <div style={{ display: 'flex', justifyContent: 'space-between', boxShadow: '0 1px black' }}>
                        <h2 style={{ margin: '0 0 0.25rem 0' }}>{InfoTipText[resource].header[page]}</h2>
                        <IconButton size="small" onClick={() => setOpen(false)}><CloseIcon /></IconButton>
                    </div>

                    <p style={{ margin: '1rem 0' }}>{InfoTipText[resource].body[page]}</p>

                    <div style={{ marginTop: 'auto' }}>
                        <IconButton size="small" disabled={page <= 0} onClick={() => setPage(prev => prev - 1)}><ChevronLeftIcon /></IconButton>
                        <IconButton size="small" disabled={page >= InfoTipText[resource].body.length - 1}
                            onClick={() => setPage(prev => prev + 1)}><ChevronRightIcon /></IconButton>
                    </div>
                </Stack>

            </Popover>
        </>
    )
}

type InfoTipTypes =
    | "inventory"
    | "user"

const InfoTipText = {
    inventory: {
        header: ["Navigation", "Moving items", "Sorting", "Filtering", "Folder view"],
        body: ["Double-click to view an item or enter a folder.",
            "Drag any row into another folder or the yellow directory name above to move them.",
            "Click on 'Name', 'Quantity', 'Last Modified' to sort. Click again to sort in reverse order.",
            "Click on 'Categories' to select and apply your filters",
            "Click on 'Sort' to choose whether to display folders on top or mixed."]
    },

    user: {
        header: ["Adding users", "Owner Role", "Admin Role", "Member Role", "Pending users"],
        body: ["Enter the user's email to add them into the organization. They must have registered.",
            `Owners are able to do everything, including deleting the organization, and except modifying logs. 
                        There must be at least one owner per organization.`,
            `Admins are able to edit other admins and members, and modify the inventory.`,
            `Members only have view-only access to organization features.`,
            `Pending users are those that applied to join the organization. Admins and above can choose to accept or reject their entry.`
        ]
    }
}