import { BarChart } from "@mui/x-charts";
import { Box, Typography } from "@mui/material";
import useItemInOrgChartData from "../hooks/useItemInOrgChartData";
import { yellow } from "@mui/material/colors";

function ItemInOrgChart({ orgId }: { orgId: number }) {
    const { dataset } = useItemInOrgChartData(orgId);

    return (
        <Box mt={2}>
            <Typography variant="h6" fontWeight={600} mb={2} textAlign="center">
                Current Item Stock
            </Typography>
            <BarChart
                dataset={dataset}
                xAxis={[{ scaleType: "band", dataKey: "name" }]}
                series={[{ dataKey: "quantity", label: "Quantity" }]}
                borderRadius={20}
                height={500}
            />
        </Box>
    );
}

export default ItemInOrgChart;