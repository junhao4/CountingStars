import "./LogPage.css";
import { useOrgContext, type ValidOrg } from "../../../common/contexts/OrgContext.tsx";
import { useEffect, useState } from "react";
import {
    fetchLogs,
    type LogFetch,
} from "../../../features/organization/log/api/LogApi.tsx";
import LogRow from "../../../features/organization/log/components/LogRow.tsx";
import { Container, Paper, Typography } from "@mui/material";
import LogHeader from "../../../features/organization/log/components/LogHeader.tsx";

export default function LogPage() {
    const { org } = useOrgContext() as ValidOrg

    const [logs, setLogs] = useState<LogFetch[]>([]);

    useEffect(() => {
        fetchLogs(org, setLogs)
    }, [])

    /* return (
        <>
            <table className='log-table'>
                <thead className='log-table-header log-table-row'>
                    <tr>
                        <td>Index</td>
                        <td>Type</td>
                        <td>Date</td>
                    </tr>
                </thead>
                <tbody className='log-table-body log-table-row'>
                    {logs.map((log, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{generateLogMessage(log.type, log.user_name, log.item_name, log.metadata)}</td>
                                <td>{new Date(log.created_at).toTimeString()}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    ) */
    return (
        <>
            <Container>
                <Typography variant="h2" sx={{ my: 2 }}>
                    Inventory Logs
                </Typography>
                <Typography
                    variant="h6"
                    sx={{ my: 2, color: "grey", fontWeight: 400 }}
                >
                    View all recorded actions in your organization
                </Typography>
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
