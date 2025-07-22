import { Box, Button, Collapse, Grid, Typography } from "@mui/material";
import ThemeRadio from "./ThemeRadio";
import { useEffect, useState } from "react";
import { useThemeContext } from "../../../common/contexts/ThemeContext";
import LightImg from "../../../assets/CountingStarsLight.png";
import DarkImg from "../../../assets/CountingStarsDark.png";
import SystemImg from "../../../assets/CountingStarsSystem.png";
import CustomImg from "../../../assets/CountingStarsCustom.png";

export function ThemeSettingsBox() {
    const { themeMode, setAndSaveThemeMode } = useThemeContext();
    const [selected, setSelected] = useState(themeMode);
    const [selectedBase, setSelectedBase] = useState("#ffffff");
    const [selectedAccent, setSelectedAccent] = useState("#ffffff");
    const { setAndSaveAccent, setAndSaveBase, customAccent, customBase } =
        useThemeContext();

    useEffect(() => {
        setSelectedBase(customBase);
        setSelectedAccent(customAccent);
    }, [customAccent, customBase]);

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

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 2,
                                bgcolor: "transparent",
                            }}
                        >
                            <Typography
                                component="label"
                                htmlFor="base"
                                variant="body2"
                                sx={{ fontWeight: 500, minWidth: 120 }}
                            >
                                Base Colour:
                            </Typography>
                            <input
                                id="base"
                                type="color"
                                value={selectedBase}
                                onChange={(e) =>
                                    setSelectedBase(e.target.value)
                                }
                                style={{
                                    width: 40,
                                    height: 32,
                                    border: "1px solid var(--border)",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 2,
                                bgcolor: "transparent",
                            }}
                        >
                            <Typography
                                component="label"
                                htmlFor="accent"
                                variant="body2"
                                sx={{ fontWeight: 500, minWidth: 120 }}
                            >
                                Accent Colour:
                            </Typography>
                            <input
                                id="accent"
                                type="color"
                                value={selectedAccent}
                                onChange={(e) =>
                                    setSelectedAccent(e.target.value)
                                }
                                style={{
                                    width: 40,
                                    height: 32,
                                    border: "1px solid var(--border)",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            />
                        </Box>

                        <Box mt={3} sx={{ bgcolor: "transparent" }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setAndSaveBase(selectedBase);
                                    setAndSaveAccent(selectedAccent);
                                }}
                            >
                                Save Colours
                            </Button>
                        </Box>
                    </Box>
                </Collapse>
                    </Grid>
                    
                </Grid>
                
            </Box>
        </>
    );
}
