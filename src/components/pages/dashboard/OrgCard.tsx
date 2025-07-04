import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import type { DashboardOrganizationFetch } from "./DashboardController";

interface OrgCardProps {
    org: DashboardOrganizationFetch
    index: number
    onEnterOrgClick: (arg0: number) => void
}

export default function OrgCard({org, index, onEnterOrgClick}: OrgCardProps) {
    return (
        <Card sx={{ width: 'max(10%,200px)' }} key={index}>
            {org.imageUrlBlob
                ? <CardMedia sx={{ height: '150px' }} image={org.imageUrlBlob} />
                : <CardMedia />
            }
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant='h6' sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{org.name}</Typography>
            </CardContent>
            <CardActions style={{ justifyContent: 'space-evenly' }}>
                <Button variant='outlined' onClick={() => onEnterOrgClick(index)}>Enter</Button>
            </CardActions>
        </Card>
    )
}