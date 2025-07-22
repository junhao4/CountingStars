
import { useOrgContext, type ValidOrg } from "../../../common/contexts/OrgContext.tsx";
import { useEffect, useState } from "react";
import {
    fetchLogs,
    filterToType,
    type FilterType,
    type LogFetchS,
} from "../../../features/organization/log/api/LogApi.tsx";
import LogRow from "../../../features/organization/log/components/LogRow.tsx";
import { Container, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import LogHeader from "../../../features/organization/log/components/LogHeader.tsx";
import LogFilterSelect from "../../../features/organization/log/components/LogFilterSelect.tsx";
import { handleGenerateAlert } from "../../../common/functions/ErrorAlerts.tsx";
import { useAlertContext } from "../../../common/contexts/AlertContext.tsx";

export default function LogPage() {
    const { org } = useOrgContext() as ValidOrg
    const { createAlert } = useAlertContext()

    const [logs, setLogs] = useState<LogFetchS[]>([]);

    const [search, setSearch] = useState<string>("")
    const [filters, setFilters] = useState<FilterType[]>([])

    const [filteredLogs, setFilteredLogs] = useState<LogFetchS[]>([])

    useEffect(() => {
        // Sets log data
        fetchLogs(org.id)
            .then(data => data === 'logError' 
                ? handleGenerateAlert('logError', createAlert) 
                : setLogs(data.map(d => ({...d, user_name: d.Users.name || "DELETED USER", item_name: d.Items.name}))))
    }, [])

    useEffect(() => {
        // Filter item names with search string and if type filters are selected, select those only
        const acceptedTypes = filters.flatMap(filter => filterToType[filter])
        setFilteredLogs(logs.filter(log => {
            return (log.item_name.toLowerCase().includes(search.toLowerCase()) &&
                (filters.length === 0 || acceptedTypes.includes(log.typeString)))
        }))
    }, [logs, search, filters])

    return (
        <>
            <Container>
                <Grid container sx={{ justifyContent: "space-between", mb: 2 }}>
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

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField placeholder="Search Text" onChange={e => setSearch(e.target.value)} />
                        <LogFilterSelect filter={filters} setFilter={setFilters} />
                    </div>
                </Grid>

                <Paper>
                    <LogHeader />
                    {filteredLogs.length === 0 ? (
                        <Typography variant="h3" sx={{ px: 2, py: 2, textAlign: "center" }}>
                            No logs available
                        </Typography>
                    ) : (
                        filteredLogs.map((log, index) => (
                            <LogRow key={index} log={log} index={index + 1} />
                        ))
                    )}
                </Paper>
            </Container>
        </>
    );
}
