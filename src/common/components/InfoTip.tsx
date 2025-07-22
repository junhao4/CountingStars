import { Divider, IconButton, Popover, Stack } from "@mui/material"
import { useRef, useState } from "react"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface InfoTipProps {
    header: string[]
    body: string[]
}

export default function InfoTip({ header, body }: InfoTipProps) {
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
                <Stack width={"16rem"}>
                    <div style={{display:'flex', justifyContent:'space-between', boxShadow:'0 1px black'}}>
                        <h2 style={{ margin: '0 0 0.25rem 0' }}>{header[page]}</h2>
                        <IconButton size="small" onClick={() => setOpen(false)}><CloseIcon /></IconButton>
                    </div>

                    <p style={{margin:'1rem 0'}}>{body[page]}</p>

                    <div>
                        <IconButton size="small" disabled={page <= 0} onClick={() => setPage(prev => prev - 1)}><ChevronLeftIcon /></IconButton>
                        <IconButton size="small" disabled={page >= body.length - 1} onClick={() => setPage(prev => prev + 1)}><ChevronRightIcon /></IconButton>
                    </div>
                </Stack>

            </Popover>
        </>
    )
}