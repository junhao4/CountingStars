import { useEffect, useState } from "react";
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext";
import ItemQuantityChart from "../../../features/organization/charts/components/ItemQuantityChart";
import TotalQuantityChart from "../../../features/organization/charts/components/TotalQuantityChart";
import ItemSelect from "../../../features/organization/inventory/itemSelect/ItemSelect";
import { Box, Container, Typography } from "@mui/material";
import { useOrgContext } from "../../../common/contexts/OrgContext";
import ItemInOrgChart from "../../../features/organization/charts/components/ItemInOrgChart";
import InfoTip from "../../../common/components/InfoTip";

function ChartsPage() {
    const { setTitle } = usePageTitleContext();
    const { org } = useOrgContext();
    const [ selectedIds, setSelectedIds ] = useState<number[]>([])

    useEffect(() => {
        setTitle("Charts");
    }, []);

    return (
        <Container sx={{ mt: 4 }}>
           
            <Box
                sx={{
                    mb: 4,
                    border: "1px solid var(--border)",
                    p: 2,
                    borderRadius: 2,
                    width: "100%",
                 
                }}
            >
                 
                 
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Box flex={1} />
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        align="center"
                        flex={1.5}
                    >
                        Item Stock Over Time
                    </Typography>
                    <div style={{ display: 'flex', justifyContent:'right', gap: '1rem' }}>
                    
                    <Box flex={1} display="flex" justifyContent="flex-end" marginRight={2}>
                        <ItemSelect selectedIds={selectedIds} setSelectedIds={setSelectedIds}/>
                    </Box>
                    <InfoTip resource="itemTimeChart" />
                    </div>
                </Box>
                
                <ItemQuantityChart
                    itemIds={selectedIds}
                ></ItemQuantityChart>
                  </Box>
                  <Box  sx={{
                    mb: 4,
                    border: "1px solid var(--border)",
                    p: 2,
                    borderRadius: 2,
                    width: "100%",
                }}>
                
                <TotalQuantityChart orgId={org?.id!}></TotalQuantityChart>
                </ Box>
                <Box  sx={{
                    mb: 20,
                    border: "1px solid var(--border)",
                    p: 2,
                    borderRadius: 2,
                    width: "100%",
                }}>
                <ItemInOrgChart orgId={org?.id!}></ItemInOrgChart>
          </Box>
        </Container>
    );
}

export default ChartsPage;
