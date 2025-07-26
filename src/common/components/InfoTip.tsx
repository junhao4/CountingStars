import { IconButton, Popover, Stack, Tooltip } from "@mui/material"
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
            <Tooltip title="Help">
                <IconButton ref={ref}
                onClick={() => setOpen(prev => !prev)}><HelpOutlineIcon /></IconButton>
            </Tooltip>

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
    | "dashboard"
    | "itemTimeChart"
    | "totalChart"
    | "itemBarChart"

const InfoTipText = {
    inventory: {
        header: ["Navigation", "Moving items", "Sorting", "Filtering", "Folder view"],
        body: ["Double-click to view an item or enter a folder.  Only owners and admins can edit inventory.",
            "Drag any row into another folder or the yellow directory name above to move them.",
            "Click on 'Name', 'Quantity', 'Last Modified' to sort. Click again to sort in reverse order.",
            "Click on 'Categories' to select and apply your filters",
            "Click on 'Sort' to choose whether to display folders on top or mixed."]
    },

    user: {
        header: ["Adding users", "Owner Role", "Admin Role", "Member Role", "Pending users"],
        body: ["Enter the user's email to add them into the organization. They must have registered.",
            `Owners are able to do everything, including deleting the organization, and except modifying logs. 
                There must be at least one owner.`,
            `Admins are able to edit other admins and members, and modify the inventory.`,
            `Members only have view-only access to organization features.`,
            `Pending users are those that applied to join the organization. Admins and above can choose to accept or reject their entry.`
        ]
    },

    dashboard: {
        header: ["New organization", "Joining"],
        body: [
            "Create an organization via the 'Create organization' button, and fill out a new name and image for your organization.",
            "Request to join another organization using their organization ID. You can only enter the organization once they have approved your entry."
        ]
    },

    itemTimeChart: {
        header: ["Item Stock"],
        body: [
            "Compare the stock of different items over time, you can search for and select which items to include in the comparison."
        ]
    },

    totalChart: {
        header: ["Total Stock"],
        body: [
            "See the trend of the total number of items in your inventory over time."
        ]
    },

    itemBarChart: {
        header: ["Item Bars"],
        body: [
            "Compare the stock of different items currently in your inventory."
        ]
    }
}