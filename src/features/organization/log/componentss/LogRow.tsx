import { Chip, Grid, Typography } from "@mui/material";
import LogTypeChip from "./LogTypeChip";
import { generateLogMessage, type LogFetch } from "../api/LogApi";


function LogRow({log, index} : {log : LogFetch, index : number}) {
    return (
        <Grid
            container
            sx={{
                px: 2,
                py: 1.5,
                borderBottom: "1px solid var(--foreground-text)",
                borderLeft:  "1px solid var(--foreground-text)",
                borderRight:  "1px solid var(--foreground-text)",
                display: "grid",
                gridTemplateColumns: "5% 15% 60% 20%",
                alignItems: "center",
            }}
        >
            <Grid>
                <Typography variant="body2">
                    {index}
                </Typography>
            </Grid>
            <Grid>
                 <LogTypeChip type = {log.type}/>
            </Grid>
            <Grid>
                <Typography variant="body1">{generateLogMessage(log.type, log.user_name, log.item_name, log.metadata)}</Typography>
            </Grid>
            <Grid>
                <Typography variant="body1">{new Date(log.created_at).toLocaleString("en-SG", {hour12 : false})}</Typography>
            </Grid>
        </Grid>
    );
}

export default LogRow;
