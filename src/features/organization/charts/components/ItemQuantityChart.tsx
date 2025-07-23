import { LineChart } from "@mui/x-charts";
import useItemQuantityChartData from "../hooks/useItemQuantityChartData";
import { useOrgContext } from "../../../../common/contexts/OrgContext";

function ItemQuantityChart() {
    const {org} = useOrgContext()
    const itemId = 104;
    const chartData = useItemQuantityChartData(itemId);

    return (
        chartData && (
            <LineChart
            
                dataset={chartData}
                xAxis={[{ scaleType: "time", dataKey: "date" }]}
                series={[{ curve: "linear", dataKey: "stock", label: "Quantity of" }]}
                height={400}
            />
        )
    );
}

export default ItemQuantityChart;
