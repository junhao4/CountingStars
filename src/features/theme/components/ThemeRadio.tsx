import { Radio, Typography } from "@mui/material";
import { Box } from "@mui/system";

interface RadioProps {
    text: string;
    img: string;
    id: number;
    selected: number;
    setSelected: React.Dispatch<React.SetStateAction<number>>;
    func? : () => void
}

function ThemeRadio({ text, img, id, selected, setSelected, func }: RadioProps) {
    return (
        <>
            <Box
                onClick={() => {
                    setSelected(id)
                    func?.()
                }
                }
                sx={{
                    border:
                        selected == id ? "2px solid black" : "2px solid grey",
                    borderRadius: 2,
                    pt: 1.5,
                    px: 1.5,
                    cursor: "pointer",
                    bgcolor: "transparent",
                    height: 148,
                }}
            >
                <Box
                    component="img"
                    src={img}
                    alt={text}
                    sx={{ width: 180, height: 110, borderRadius: 2 }}
                />

                <Box sx={{ bgcolor: "transparent", display: "flex" }}>
                    <Radio
                        checked={selected == id}
                        value={text}
                        sx={{
                            "& .MuiSvgIcon-root": {
                                fontSize: 16,
                            },
                        }}
                    />

                    <Typography sx={{ mt: 0.8, fontSize: 15, fontWeight: 420 }}>
                        {text}
                    </Typography>
                </Box>
            </Box>
        </>
    );
}

export default ThemeRadio;
