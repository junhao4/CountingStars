import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import type { DashboardOrganizationFetch } from "../api/DashboardApi";


interface OrgCardProps {
    org: DashboardOrganizationFetch
    index: number
    onEnterOrgClick: (arg0: number) => void
}

export default function DashboardCard({org, index, onEnterOrgClick}: OrgCardProps) {
    return (
        <Card sx={{ width: 'max(10%,200px)' }} key={index}>
            <CardMedia sx={{ height: '150px' }} image={org.imageUrlBlob} />
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant='h6' sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{org.name}</Typography>
            </CardContent>
            <CardActions style={{ justifyContent: 'space-evenly' }}>
                <Button sx={{color: 'var(--text)', borderColor: 'var(--text-muted)'}}
                variant='outlined' onClick={() => onEnterOrgClick(index)}>Enter</Button>
            </CardActions>
        </Card>
    )
}