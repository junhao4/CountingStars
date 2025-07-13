import { useMediaQuery } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
type Theme = "light" | "dark";

interface ThemeProps {
    themeMode : ThemeMode,
    setThemeMode: React.Dispatch<React.SetStateAction<ThemeMode>>
}

const ThemeContext = createContext<ThemeProps>({
    themeMode : "system",
    setThemeMode : () => {}
})

export const ThemeModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system")
  const [theme, setTheme] = useState<Theme>("dark")
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    useEffect(() => {
        if (themeMode == 'system') {
            setTheme(prefersDarkMode ? "dark" : "light")
        } else {
            setTheme(themeMode)
        }
    
    }, [themeMode, prefersDarkMode]);

    useEffect(() => {
            document.documentElement.setAttribute('data-theme', theme) 
    }, [theme])

  return (
      <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
        {children}
      </ThemeContext.Provider>
    );
  };

 export const useThemeContext = () => useContext(ThemeContext);
 

