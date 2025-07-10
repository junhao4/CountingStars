import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Container, Stack } from "@mui/material";
import { usePageTitleContext } from "../../common/contexts/PageTitleContext";
import { useOrgContext, type ValidOrg } from "../../common/contexts/OrgContext";
import { fetchItemsNumber, fetchUsersNumber } from "../../features/organization/home/api/HomeApi";
import HomeNavigateCard from "../../features/organization/home/components/HomeNavigateCard";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import InventoryIcon from "@mui/icons-material/Inventory";
import HistoryIcon from '@mui/icons-material/History';


export default function OrgHome() {
    const navigate = useNavigate();
    const { setTitle } = usePageTitleContext()
    const { org } = useOrgContext() as ValidOrg
    const [ users, setUsers ] = useState(0)
    const [ items, setItems ] = useState(0)

    useEffect(() => {
        console.log("Organization home page useEffect")
        if (org === null) navigate("/dashboard");
        setTitle(org!.name);
    }, [org]);

     useEffect(() => {
        fetchUsersNumber(org!, setUsers)
        fetchItemsNumber(org!, setItems)
    }, []);

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
                        gap: 1,
                        bgcolor: "transparent",
                    }}
                >
                    <Typography variant="h4" sx={{ pt: 2 }}>
                        {org?.name}
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
                                {org?.id}
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
              <Grid container spacing={0}  sx={{ mt: 4, px: 2, justifyContent: "space-around"}}>
                <HomeNavigateCard  route="/dashboard/organization/users">
                <Stack sx={{alignItems : "center"}}>
                    <GroupIcon sx={{ fontSize: "108px" }} />
                    Users
                    </Stack>
                </HomeNavigateCard>
                <HomeNavigateCard  route="/dashboard/organization/inventory">
                <Stack sx={{alignItems : "center"}}>
                    <InventoryIcon sx={{ fontSize: "108px" }} />
                    Inventory
                    </Stack>
                </HomeNavigateCard><HomeNavigateCard  route="/dashboard/organization/log">
                <Stack sx={{alignItems : "center"}}>
                    <HistoryIcon sx={{ fontSize: "108px" }} />
                    Logs
                    </Stack>
                </HomeNavigateCard><HomeNavigateCard  route="/dashboard/organization/settings">
                <Stack sx={{alignItems : "center"}}>
                    <SettingsIcon sx={{ fontSize: "108px" }} />
                    Settings
                    </Stack>
                </HomeNavigateCard>
              </Grid>
               {/*Not done*/}
            </Container>
        </>
    );
}