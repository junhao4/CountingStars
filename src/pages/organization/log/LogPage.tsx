import "./LogPage.css";
import { useOrgContext, type ValidOrg } from "../../../common/contexts/OrgContext.tsx";
import { useEffect, useState } from "react";
import {
    fetchLogs,
    type LogFetch,
} from "../../../features/organization/log/api/LogApi.tsx";
import LogRow from "../../../features/organization/log/components/LogRow.tsx";
import { Container, Grid, Paper, Stack, Typography } from "@mui/material";
import LogHeader from "../../../features/organization/log/components/LogHeader.tsx";
import LogFilterSelect from "../../../features/organization/log/components/LogFilterSelect.tsx";

export default function LogPage() {
    const { org } = useOrgContext() as ValidOrg

    const [logs, setLogs] = useState<LogFetch[]>([]);
    const [filter, setFilter] = useState<string[]>([])

    useEffect(() => {
        fetchLogs(org, setLogs, filter)
    }, [filter]) 

    return (
        <>
            <Container>
                <Grid container sx={{justifyContent: "space-between", mb : 2}}>
                <Stack>
                <Typography variant="h2" sx={{ my: 2 }}>
                    Inventory Logs
                </Typography>
                <Typography
                    variant="h6"
                    sx={{ color: "grey", fontWeight: 400 }}
                >
                    View all recorded actions in your organization
                </Typography>
                </Stack>
                <Grid sx={{mt : 6}}>
                <LogFilterSelect filter={filter} setFilter={setFilter}/>
                </Grid>
                </Grid>
                <Paper>
                    <LogHeader></LogHeader>
                    {logs.length === 0 ? (
                        <Typography variant="h3" sx={{ px: 2, py: 2, textAlign: "center"}}>
                            No logs available
                        </Typography>
                    ) : (
                        logs.map((log, index) => (
                            <LogRow key={index} log={log} index={index + 1} />
                        ))
                    )}
                </Paper>
            </Container>
        </>
    );
}
