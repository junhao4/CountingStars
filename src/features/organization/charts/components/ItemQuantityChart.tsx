import { LineChart } from "@mui/x-charts";
import useItemQuantityChartData from "../hooks/useItemQuantityChartData";
import { useOrgContext } from "../../../../common/contexts/OrgContext";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

function ItemQuantityChart({ itemIds }: { itemIds: number[] }) {
    const { dataset, series } = useItemQuantityChartData(itemIds);
    const maxY = Math.max(
  ...dataset.flatMap((point) =>
    series.map((s) => {
      const val = point[s.dataKey];
      return typeof val === "number" ? val : 0;
    })
  )
);

const yMax = maxY * 1.0;

    useEffect(() => {
        console.log("CHARTDATA", dataset);
    }, [dataset, series]);

    return (
        <Box textAlign={"center"}>
            <Typography
             variant="h6" fontWeight={600} mb={2}>
                Item Stock Over Time
            </Typography>
            <LineChart
                yAxis={[{ min: 0, max: yMax }]}
                dataset={dataset}
                xAxis={[{ scaleType: "time", dataKey: "date" }]}
                series={series}
                height={400}
            />
        </Box>
    );
}

export default ItemQuantityChart;
