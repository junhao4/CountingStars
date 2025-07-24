import { Box, Container } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { ThemeSettingsBox } from "../features/theme/components/ThemeSettingsBox";
import ItemQuantityChart from "../features/organization/charts/components/ItemQuantityChart";
import TotalQuantityChart from "../features/organization/charts/components/TotalQuantityChart";

export default function ThemePage() {
    // const testing =
    //     "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Test.svg/2560px-Test.svg.png";

  

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
                        width: "80%",
                    }}
                >
                    
                    
                    <ItemQuantityChart itemIds={[108,104,103]}></ItemQuantityChart>
                    
                    <TotalQuantityChart orgId={95}></TotalQuantityChart>
                </Box>
            </Container>
        </>
    );
}
