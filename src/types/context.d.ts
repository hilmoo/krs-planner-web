export type ContextType = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filSem: string | null;
  setFilSem: React.Dispatch<React.SetStateAction<string | null>>;
  filSKS: string | null;
  setFilSKS: React.Dispatch<React.SetStateAction<string | null>>;
  filDay: string | null;
  setFilDay: React.Dispatch<React.SetStateAction<string | null>>;
  filHour: string | null;
  setFilHour: React.Dispatch<React.SetStateAction<string | null>>;
};
