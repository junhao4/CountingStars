import { BarChart } from "@mui/x-charts";
import { Box, Typography } from "@mui/material";
import useItemInOrgChartData from "../hooks/useItemInOrgChartData";
import InfoTip from "../../../../common/components/InfoTip";


function ItemInOrgChart({ orgId }: { orgId: number }) {
    const { dataset } = useItemInOrgChartData(orgId);

    return (
        <Box textAlign={"center"} >
                    <Box display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2} >
                    <Typography flex={1}
                     variant="h6" fontWeight={600} mb={2}
                     pl={6} pt={2}>
                        Current Item Stock
                    </Typography>
                    <InfoTip resource="itemBarChart" />
                    </Box>
            <BarChart
                dataset={dataset}
                xAxis={[{ scaleType: "band", dataKey: "name" }]}
                series={[{ dataKey: "quantity", label: "Quantity" }]}
                borderRadius={20}
                height={500}
                grid={{ vertical: true, horizontal: true }}
            />
        </Box>
    );
}

export default ItemInOrgChart;