"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { FC, ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemesProvider>
  );
};

export { ThemeProvider };
