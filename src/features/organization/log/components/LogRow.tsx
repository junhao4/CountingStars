import { Grid, Typography } from "@mui/material";
import LogTypeChip from "./LogTypeChip";
import { generateLogMessageNew, type LogFetch, type LogFetchS, type LOGSTYPE, type metadataType } from "../api/LogApi";


function LogRow({log, index} : {log : LogFetchS, index : number}) {
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
                 <LogTypeChip type = {log.typeString! as LOGSTYPE}/>
            </Grid>
            <Grid>
                <Typography variant="body1">{generateLogMessageNew(log.typeString! as LOGSTYPE, log.user_name, log.item_name, log.metadata as metadataType[LOGSTYPE]["metadata"])}</Typography>
            </Grid>
            <Grid>
                <Typography variant="body1">{new Date(log.created_at).toLocaleString("en-SG", {hour12 : false})}</Typography>
            </Grid>
        </Grid>
    );
}

export default LogRow;
