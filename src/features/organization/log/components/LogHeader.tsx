import { Grid, Typography } from "@mui/material"


function LogHeader() {
  return (
    <>
    <Grid
            container
            sx={{
                px: 2,
                py: 1.5,
                border: "1px solid var(--foreground-text)",
    
                display: "grid",
                gridTemplateColumns: "5% 15% 60% 20%",
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
                    Type
                </Typography>
            </Grid>
            <Grid>
                <Typography variant="h6">
                    Message
                </Typography>
            </Grid>
            <Grid>
                <Typography variant="h6">
                    Date
                </Typography>
            </Grid>
            </Grid>
            </>
  )
}

export default LogHeader