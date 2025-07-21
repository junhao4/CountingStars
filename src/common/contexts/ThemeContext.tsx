import { useColorScheme, useMediaQuery } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchUser } from "../api/UserApi";
import { useSessionContext } from "./SessionContext";
import { calculateLightness, changeTheme } from "../../features/theme/api/ThemeApi";

export type ThemeMode = "light" | "dark" | "system" | "custom";

type Theme = "light" | "dark" | "custom-dark" | "custom-light";

interface ThemeProps {
    themeMode : ThemeMode,
    setAndSaveThemeMode : (themeMode: string) => void,
    setCustomBase : React.Dispatch<React.SetStateAction<string>>,
    setCustomAccent : React.Dispatch<React.SetStateAction<string>>
   
}

const ThemeContext = createContext<ThemeProps>({
    themeMode : "system",
    setAndSaveThemeMode : () => {},
    setCustomBase : () => {},
    setCustomAccent : () => {}
})


export const ThemeModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system")
  const [theme, setTheme] = useState<Theme>("dark")
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [customBase, setCustomBase] = useState("")
  const [customAccent, setCustomAccent] = useState("")
  const { session } = useSessionContext()
  //MUI theme
  const { mode, setMode } = useColorScheme()
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
            setMode(prefersDarkMode ? "dark" : "light")
        } else if (themeMode == 'custom') {
          
          console.log(customBase)
          if (calculateLightness(customBase) > 50) {
             setTheme("custom-light")
          } else {
          setTheme("custom-dark")
          }
          document.documentElement.style.setProperty('--base-color', customBase);
           document.documentElement.style.setProperty('--accent', customAccent);
        } else {
            setTheme(themeMode)
            setMode(themeMode)
        }
    
    }, [themeMode, prefersDarkMode, customBase, customAccent]);

    useEffect(() => {
            document.documentElement.setAttribute('data-theme', theme) 
    }, [theme])

  return (
      <ThemeContext.Provider value={{ themeMode, setAndSaveThemeMode, setCustomBase, setCustomAccent }}>
        {children}
      </ThemeContext.Provider>
    );
  };

 export const useThemeContext = () => useContext(ThemeContext);
 

