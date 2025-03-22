"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { FC, ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  );
};

export { ThemeProvider };
