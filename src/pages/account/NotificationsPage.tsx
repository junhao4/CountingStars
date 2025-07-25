import { useEffect } from "react";
import { usePageTitleContext } from "../../common/contexts/PageTitleContext";
import { markAsRead } from "../../features/notifications/api/NotificationsApi";
import { useSessionContext, type ValidSession } from "../../common/contexts/SessionContext";
import Loading from "../../common/components/Loading";
import TableHeader from "../../features/notifications/components/TableHeader";
import useGetNotifications from "../../features/notifications/hooks/useGetNotifications";
import TableBody from "../../features/notifications/components/TableBody";
import "../../features/notifications/components/NotificationsTable.css";
import SearchBar from "../../features/notifications/components/SearchBar";
import { Container, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import LogFilterSelect from "../../features/organization/log/components/LogFilterSelect";
import TableRow from "../../features/notifications/components/TableRow";


export default function NotificationsPage() {
    const { user } = useSessionContext() as ValidSession
    const { setTitle } = usePageTitleContext()

    const { loading, messages, handleSearch, handleDelete } = useGetNotifications()

    useEffect(() => {
        setTitle("Notifications");

        markAsRead(user.id)
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
            
           <Container sx={{width:'80%'}}>
                <Grid container sx={{ justifyContent: "space-between", mb: 0}}>
                    <Stack>
                        <Typography variant="h2" sx={{ my: 2, fontSize: 56 }}>
                            Notifications
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: "var(--text-muted)", fontWeight: 400 }}
                        >
                            View important messages
                        </Typography>
                         </Stack>
                         <div style={{ display: 'flex', alignItems: 'center', paddingTop:'8px'}}>
                        <SearchBar handleSearch={handleSearch} />
                        </div>
                        
                   

                </Grid>

                <Paper>
                    <TableHeader />
                    {messages.length === 0 ? (
                        <Typography variant="h3" sx={{ px: 2, py: 2, textAlign: "center" }}>
                            No Notifications
                        </Typography>
                    ) : (
                        messages.map((message, index) => (
                            <TableRow message={message} index={index + 1} handleDelete={handleDelete} />
                        ))
                    )}
                </Paper>
            </Container>
    
    )
}