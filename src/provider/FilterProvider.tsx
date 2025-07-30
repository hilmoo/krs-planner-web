import { useState } from "react";
import { FilterContext } from "./useFilter";
import { useDebouncedState } from "@mantine/hooks";

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [search, setSearch] = useDebouncedState("", 200);
  const [filSem, setFilSem] = useState<string | null>(null);
  const [filSKS, setFilSKS] = useState<string | null>(null);
  const [filDay, setFilDay] = useState<string | null>(null);
  const [filHour, setFilHour] = useState<string | null>(null);
  return (
    <FilterContext.Provider
      value={{
        search,
        setSearch,
        filSem,
        setFilSem,
        filSKS,
        setFilSKS,
        filDay,
        setFilDay,
        filHour,
        setFilHour,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
