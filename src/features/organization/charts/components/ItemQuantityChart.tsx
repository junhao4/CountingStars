import { LineChart } from "@mui/x-charts";
import useItemQuantityChartData from "../hooks/useItemQuantityChartData";
import { Box } from "@mui/material";

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

    return (
        <Box textAlign={"center"}>
           
            <LineChart
                yAxis={[{ min: 0, max: yMax }]}
                dataset={dataset}
                xAxis={[{ scaleType: "time", dataKey: "date" }]}
                series={series}
                height={500}
                grid={{ vertical: true, horizontal: true }}
            />
        </Box>
    );
}

export default ItemQuantityChart;
