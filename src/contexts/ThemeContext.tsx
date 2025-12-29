import React from "react";

export function ThemeProvider({ children }: any) {
  // minimal provider — could be extended to provide theme switching
  return <>{children}</>;
}

export default ThemeProvider;
