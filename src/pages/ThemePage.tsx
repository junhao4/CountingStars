import { Box, Container } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { ThemeSettingsBox } from "../features/theme/components/ThemeSettingsBox";
import ItemQuantityChart from "../features/organization/charts/components/ItemQuantityChart";

export default function ThemePage() {
    // const testing =
    //     "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Test.svg/2560px-Test.svg.png";

    const chartData = [
        { x: new Date("2024-07-01"), y: 10 },
        { x: new Date("2024-07-02"), y: 20 },
        { x: new Date("2024-07-09"), y: 15 },
    ];

    return (
        <>
            <Container sx={{ mt: 4 }}>
                <ThemeSettingsBox></ThemeSettingsBox>
                <Box
                    sx={{
                        mb: 20,
                        border: "1px solid var(--border)",
                        p: 2,
                        borderRadius: 2,
                        width: "50%",
                    }}
                >
                    <LineChart
                        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                        series={[
                            {
                                data: [2, 5.5, 2, 8.5, 1.5, 5],
                            },
                        ]}
                        height={300}
                    />
                    <LineChart
                        xAxis={[
                            {
                                scaleType: "time",
                                dataKey: "x",
                                valueFormatter: (date) =>
                                    date.toLocaleDateString(),
                            },
                        ]}
                        yAxis={[{
                            max : 25
                        }]}
                        series={[
                            {
                                dataKey: "y",
                                label: "Value",
                            },
                        ]}
                        dataset={chartData}
                        width={600}
                        height={300}
                    />
                    <ItemQuantityChart></ItemQuantityChart>
                </Box>
            </Container>
        </>
    );
}
