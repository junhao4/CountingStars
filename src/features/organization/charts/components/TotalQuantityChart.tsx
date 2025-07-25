import { LineChart } from "@mui/x-charts";
import { Box, Typography } from "@mui/material";
import { useTotalQuantityChartData } from "../hooks/useTotalQuantityChartData";

function TotalQuantityChart({ orgId }: { orgId: number }) {
    const {dataset}  = useTotalQuantityChartData(orgId)

    return (
        <Box textAlign={"center"}>
            <Typography
             variant="h6" fontWeight={600} mb={2}>
                Total Stock Over Time
            </Typography>
            <LineChart
  dataset={dataset}
  series={[{curve : 'monotoneX', area: true ,dataKey: "total", label: "Total Stock" ,showMark: true }]}
  xAxis={[{ dataKey: "date", scaleType: "time" }]}
  yAxis={[{ min: 0 }]}
  height={500}
    grid={{ vertical: true, horizontal: true }}
/>
        </Box>
    );
}

export default TotalQuantityChart;
