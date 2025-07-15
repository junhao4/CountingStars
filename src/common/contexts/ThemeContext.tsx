import { useMediaQuery } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchUser } from "../api/UserApi";
import { useSessionContext } from "./SessionContext";
import { changeTheme } from "../../features/theme/api/ThemeApi";

export type ThemeMode = "light" | "dark" | "system";
type Theme = "light" | "dark";

interface ThemeProps {
    themeMode : ThemeMode,
    setAndSaveThemeMode : (themeMode: string) => void
   
}

const ThemeContext = createContext<ThemeProps>({
    themeMode : "system",
    setAndSaveThemeMode : () => {}
})


export const ThemeModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system")
  const [theme, setTheme] = useState<Theme>("dark")
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { session } = useSessionContext()
  const setAndSaveThemeMode = (themeMode : string) => {
      setThemeMode(themeMode as ThemeMode)
      changeTheme(session?.user.id!, themeMode)
  }
 

    useEffect(() => {
        const getTheme = async () => {
        const user = await fetchUser(session?.user.id!);
        const userTheme = user!.theme
        setThemeMode(userTheme as ThemeMode)
        }
        getTheme()
    }, [session])

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
      <ThemeContext.Provider value={{ themeMode, setAndSaveThemeMode }}>
        {children}
      </ThemeContext.Provider>
    );
  };

 export const useThemeContext = () => useContext(ThemeContext);
 

