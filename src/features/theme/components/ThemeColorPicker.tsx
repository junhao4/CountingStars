import { Box, Button, Typography } from "@mui/material"
import { useRef, useState, type ChangeEvent } from "react"
import { useThemeContext } from "../../../common/contexts/ThemeContext";
import "./ThemeColorPicker.css"


export default function ThemeColorPicker() {
    const { setAndSaveAccent, setAndSaveBase } = useThemeContext()

    const [selectedAccent, setSelectedAccent] = useState("#ffffff")
    const [selectedBase, setSelectedBase] = useState("#ffffff");

    const accentRef = useRef<number>(0)

    const baseRef = useRef<number>(0)

    const handleAccentChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value
        if (accentRef.current) {
            clearTimeout(accentRef.current)
        }
        accentRef.current = window.setTimeout(() => {
            setSelectedAccent(newColor)
        }, 250)
    }

    const handleBaseChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value
        if (baseRef.current) {
            clearTimeout(accentRef.current)
        }
        baseRef.current = window.setTimeout(() => {
            setSelectedBase(newColor)
        }, 250)
    }

    return (
        <div>

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
                    onChange={handleBaseChange}
                    className="theme-color-picker"
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
                    onChange={handleAccentChange}
                    className="theme-color-picker"
                />
            </Box>

            <Button
                variant="contained"
                onClick={() => {
                    setAndSaveBase(selectedBase);
                    setAndSaveAccent(selectedAccent);
                }}
            >
                Save Colours
            </Button>

        </div>
    )
}