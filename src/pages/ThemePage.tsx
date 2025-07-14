import { Box, Button, Grid, Radio, Stack, Typography } from "@mui/material"
import { useThemeContext } from "../common/contexts/ThemeContext"
import { useState } from "react"
import ThemeRadio from "../features/theme/components/ThemeRadio"






function ThemePage() {
    const { setThemeMode } = useThemeContext()
    const [ selected, setSelected ] = useState(3)

  return (
    <>
    <Grid container justifyContent={"center"} spacing={4}>
      <Grid>
     <ThemeRadio text="Light" img="src\assets\CountingStarsLight.png"
      id={1} selected={selected} setSelected={setSelected} func={() => setThemeMode("light")}></ThemeRadio>
      </Grid>
      <Grid>
    <ThemeRadio text="Dark" img="src\assets\CountingStarsDark.png"
      id={2} selected={selected} setSelected={setSelected} func={() => setThemeMode("dark")}></ThemeRadio>
      </Grid>
      <Grid>
      <ThemeRadio text="System" img="src\assets\CountingStarsSystem.png"
      id={3} selected={selected} setSelected={setSelected} func={() => setThemeMode("system")}></ThemeRadio>
      </Grid>
      
    </Grid>
    </>
  )
}

export default ThemePage