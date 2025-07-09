import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Paper,
    Container,
    Stack,
} from "@mui/material";
import { usePageTitleContext } from "../../common/contexts/PageTitleContext";
import { useOrgContext } from "../../common/contexts/OrgContext";
import { fetchItemsNumber, fetchUsersNumber } from "../../features/organization/home/api/HomeApi";


export default function OrgHome() {
    const navigate = useNavigate();
    const { setTitle } = usePageTitleContext();
    const { getOrgContext } = useOrgContext();
    const orgProps = getOrgContext();
    const [ users, setUsers ] = useState(0)
    const [ items, setItems ] = useState(0)

    useEffect(() => {
        if (orgProps === null) navigate("/dashboard");
        setTitle(orgProps!.name);
    }, []);

     useEffect(() => {
        fetchUsersNumber(orgProps!, setUsers)
        fetchItemsNumber(orgProps!, setItems)
    });

    return (
        <>
            <Container sx={{width : "100%"}}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        px: 1,
                        pt: 4,
                        gap: 10,
                        bgcolor: "transparent",
                    }}
                >
                    <Typography variant="h4" sx={{ pt: 2 }}>
                        {orgProps?.name}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 3,
                            flexWrap: "wrap",
                            bgcolor: "transparent",
                        }}
                    >
                        <Grid container spacing={4} sx={{ pt : 1}}>
                        <Stack>
                             <Typography variant="body1" align="center" sx={{color : 'var(--muted-foreground)'}}>Users</Typography>
                            <Typography variant="h5" align="center">
                                {users}
                            </Typography>
                        </Stack>
                        <Stack>
                             <Typography variant="body1" align="center" sx={{color : 'var(--muted-foreground)'}}>Items</Typography>
                            <Typography variant="h5" align="center">
                                {items}
                            </Typography>
                        </Stack>
                        <Stack>
                            <Typography variant="body1" align="center" sx={{color : 'var(--muted-foreground)'}}>ID</Typography>
                            <Typography variant="h5" align="center">
                                {orgProps?.id}
                            </Typography>
                        </Stack>
                        </Grid>
                    </Box>
                </Box>
                <div style={{
                height: "2px",
                width: "100%",
                backgroundColor: "var(--muted-foreground)",
                alignSelf: "center",
                marginTop: "60px",
                
              }} />
              {/*Not done*/}
              <Grid container spacing={4}  sx={{ mt: 4, px: 2 }}>
                <Card>Users</Card>
                <Card>Inventory</Card>
                <Card>Logs</Card>
                <Card>Settings</Card>
              </Grid>
               {/*Not done*/}
            </Container>
        </>
    );
}