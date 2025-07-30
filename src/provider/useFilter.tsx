import { createContext, useContext } from "react";
import type { ContextType } from "../types/context";

export const FilterContext = createContext<ContextType | undefined>(undefined);

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
