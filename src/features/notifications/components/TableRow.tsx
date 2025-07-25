import { Grid, IconButton, Typography } from "@mui/material";
import type { NotifMessage } from "../hooks/useGetNotifications";
import DeleteIcon from "@mui/icons-material/Delete";

function TableRow({
    message,
    index,
    handleDelete,
}: {
    message: NotifMessage;
    index: number;
    handleDelete: (id: number) => () => Promise<void>;
}) {
    return (
        <Grid
            container
            sx={{
                px: 2,
                py: 1.5,
                borderBottom: "1px solid var(--text)",
                borderLeft: "1px solid var(--text)",
                borderRight: "1px solid var(--text)",
                display: "grid",
                gridTemplateColumns: "5% 65% 20% 5%",
                alignItems: "center",
            }}
        >
            <Grid>
                <Typography variant="body2">{index}</Typography>
            </Grid>

            <Grid>
                <Typography variant="body1">{message.msg}</Typography>
            </Grid>
            <Grid>
                <Typography variant="body1">{message.time}</Typography>
            </Grid>
            <Grid>
                <IconButton
                    onClick={handleDelete(message.id)}
                    aria-label="delete"
                    size="large"
                >
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            </Grid>
        </Grid>
    );
}

export default TableRow;
