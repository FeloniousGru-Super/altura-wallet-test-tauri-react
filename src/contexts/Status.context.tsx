import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type TStatusContext = {
  isAccountDetailModalOpen: boolean;
  setIsAccountDetailModalOpen: Dispatch<SetStateAction<boolean>>;
  isImportTokenModalOpen: boolean;
  setIsImportTokenModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const StatusContext = createContext<TStatusContext>({
  isAccountDetailModalOpen: false,
  setIsAccountDetailModalOpen: () => {},
  isImportTokenModalOpen: false,
  setIsImportTokenModalOpen: () => {},
});

export const StatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAccountDetailModalOpen, setIsAccountDetailModalOpen] =
    useState<boolean>(false);
  const [isImportTokenModalOpen, setIsImportTokenModalOpen] =
    useState<boolean>(false);

  return (
    <StatusContext.Provider
      value={{
        isAccountDetailModalOpen,
        setIsAccountDetailModalOpen,
        isImportTokenModalOpen,
        setIsImportTokenModalOpen,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => useContext(StatusContext);
