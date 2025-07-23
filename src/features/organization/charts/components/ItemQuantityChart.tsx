import { LineChart } from "@mui/x-charts";
import useItemQuantityChartData, { type ChartPoint } from "../hooks/useItemQuantityChartData";
import { useOrgContext } from "../../../../common/contexts/OrgContext";
import { useEffect, useState } from "react";

function ItemQuantityChart() {
    const {org} = useOrgContext()
    const itemId = 104;
     const chartData = useItemQuantityChartData(itemId);
    const name = chartData?.[0]?.name

    useEffect(() => {
        console.log("CHARTDATA", chartData)
    })

    return (
        chartData && (
            <LineChart
                yAxis={[{ min: 0 }]}
                dataset={chartData}
                xAxis={[{  scaleType: "time", dataKey: "date" }]}
                series={[{ curve: "linear", dataKey: "stock", label: "Quantity of " + name }]}
                height={400}
            />
        )
    );
}

export default ItemQuantityChart;
