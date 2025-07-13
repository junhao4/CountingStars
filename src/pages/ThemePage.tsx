import { Button, Stack } from "@mui/material"
import { useThemeContext } from "../common/contexts/ThemeContext"






function ThemePage() {
    const { setThemeMode } = useThemeContext()

  return (
    <>
    <div style={{display : 'block'}}>
    <div style={{display : 'block'}}>ThemePage</div>
    <div>
    <Button onClick={() => setThemeMode("light")}>Light</Button>
    <Button onClick={() => setThemeMode("dark")}>Dark</Button>
    <Button onClick={() => setThemeMode("system")}>System</Button>
    </div>
    </div>
    </>
  )
}

export default ThemePage