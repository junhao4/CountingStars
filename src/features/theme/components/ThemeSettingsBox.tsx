import { Box, Collapse, Grid, Typography } from "@mui/material";
import ThemeRadio from "./ThemeRadio";
import { useEffect, useState } from "react";
import { useThemeContext } from "../../../common/contexts/ThemeContext";
import LightImg from "../../../assets/CountingStarsLight.png";
import DarkImg from "../../../assets/CountingStarsDark.png";
import SystemImg from "../../../assets/CountingStarsSystem.png";
import CustomImg from "../../../assets/CountingStarsCustom.png";
import ThemeColorPicker from "./ThemeColorPicker";

export function ThemeSettingsBox() {
    const { themeMode, setAndSaveThemeMode } = useThemeContext();
    const [selected, setSelected] = useState(themeMode);

    useEffect(() => {
        setSelected(themeMode);
    }, [themeMode]);
    
    return (
        <>
            <Box
                sx={{
                    border: "1px solid var(--border)",
                    borderRadius: 2,
                    mb: 4,
                    p: 2,
                    mx: "auto",
                }}
            >
                <Typography variant="h6" fontWeight={600} mx={2} mt={1}>
                    Theme
                </Typography>
                <Typography
                    variant="body2"
                    mb={4}
                    mx={2}
                    color="var(--text-muted)"
                >
                    Choose how Counting Stars looks for you.
                </Typography>
                <Grid
                    container
                    justifyContent={"flex-start"}
                    spacing={4}
                    sx={{ m: 3 }}
                    columns={3}
                >
                    <Grid>
                        <ThemeRadio
                            text="Light"
                            img={LightImg}
                            id={"light"}
                            selected={selected}
                            setSelected={setSelected}
                            func={() => setAndSaveThemeMode("light")}
                        ></ThemeRadio>
                    </Grid>
                    <Grid>
                        <ThemeRadio
                            text="Dark"
                            img={DarkImg}
                            id={"dark"}
                            selected={selected}
                            setSelected={setSelected}
                            func={() => setAndSaveThemeMode("dark")}
                        ></ThemeRadio>
                    </Grid>
                    <Grid>
                        <ThemeRadio
                            text="System"
                            img={SystemImg}
                            id={"system"}
                            selected={selected}
                            setSelected={setSelected}
                            func={() => setAndSaveThemeMode("system")}
                        ></ThemeRadio>
                    </Grid>
                    <Grid>
                        <ThemeRadio
                            text="Custom"
                            img={CustomImg}
                            id={"custom"}
                            selected={selected}
                            setSelected={setSelected}
                            func={() => setAndSaveThemeMode("custom")}
                        ></ThemeRadio>
                    </Grid>
                    <Grid>
                        <Collapse in={selected === "custom"}>
                            <Box
                                marginRight={0}
                                padding={2}
                                sx={{
                                    border: "1px solid var(--border)",
                                    bgcolor: "transparent",
                                    borderRadius: 2,
                                }}
                            >
                                <Typography variant="h6" mb={2}>
                                    Custom Theme Colours
                                </Typography>

                                <ThemeColorPicker />

                            </Box>
                        </Collapse>
                    </Grid>

                </Grid>

            </Box>
        </>
    );
}
