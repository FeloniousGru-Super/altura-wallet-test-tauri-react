import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { Store } from "tauri-plugin-store-api";

type TThemeContext = {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
};

export const ThemeContext = createContext<TThemeContext>({
  isDarkMode: true,
  setIsDarkMode: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const store = new Store(".settings.dat");

  const [isDarkMode, setIsDarkMode] = useState(true);

  const themeOptions: any = useMemo(
    () => ({
      palette: {
        mode: !isDarkMode ? "light" : "dark",
      },
      shape: { borderRadius: 0 },
      typography: {
        fontFamily: "Montserrat Alternates, sans-serif, cursive",
      },
    }),
    [isDarkMode]
  );

  const theme = createTheme(themeOptions);

  useEffect(() => {
    (async () => {
      const theme = await store.get("theme");
      if (theme === "light") {
        setIsDarkMode(false);
      } else {
        setIsDarkMode(true);
      }
    })();
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext) as TThemeContext;
