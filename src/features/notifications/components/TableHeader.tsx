import { Grid, Typography } from "@mui/material"


function TableHeader() {
  return (
    <>
    <Grid
            container
            sx={{
                px: 2,
                py: 1.5,
                border: "1px solid var(--text)",
    
                display: "grid",
                gridTemplateColumns: "5% 65% 20% 5%",
                alignItems: "center",
            }}
        >
    <Grid>
                <Typography variant="h6">
                    #
                </Typography>
            </Grid>
            <Grid>
                <Typography variant="h6">
                    Message
                </Typography>
            </Grid>
            <Grid>
                <Typography  variant="h6">
                    Date
                </Typography>
            </Grid>
            <Grid>
                <Typography variant="h6">
                    Action
                </Typography>
            </Grid>
            </Grid>
            </>
  )
}

export default TableHeader