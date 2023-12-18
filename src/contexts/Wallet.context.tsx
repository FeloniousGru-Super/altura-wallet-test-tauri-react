import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "tauri-plugin-store-api";

export const networks: TNetwork[] = [
  {
    chainId: 1,
    name: "Ethereum",
    rpcUrl: import.meta.env.VITE_APP_ETHEREUM_RPC_URL,
  },
  {
    chainId: 5,
    name: "Goerli Ethereum",
    rpcUrl: import.meta.env.VITE_APP_GOERLI_RPC_URL,
  },
];

export type TNetwork = {
  chainId: number;
  name: string;
  rpcUrl: string;
};

export type TImportToken = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance?: string;
} | null;

export type TToken = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance?: string;
};

export type TTokens = {
  [tokenAddress: string]: TToken;
};

export type TAllTokens = {
  [chainId: string]: TTokens;
};

export type TSeletedToken = {
  [chainId: string]: string;
};

type TWalletContext = {
  encryptedWalletInfo: string;
  setEncryptedWalletInfo: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  isLogged: boolean;
  setIsLogged: Dispatch<SetStateAction<boolean>>;
  selectedNetwork: TNetwork;
  setSelectedNetwork: Dispatch<SetStateAction<TNetwork>>;
  tokens: TAllTokens;
  setTokens: Dispatch<SetStateAction<TAllTokens>>;
  selectedToken: TSeletedToken;
  setSelectedToken: Dispatch<SetStateAction<TSeletedToken>>;
};

export const WalletContext = createContext<TWalletContext>({
  encryptedWalletInfo: "",
  setEncryptedWalletInfo: () => {},
  password: "",
  setPassword: () => {},
  isLogged: false,
  setIsLogged: () => {},
  selectedNetwork: networks[0],
  setSelectedNetwork: () => {},
  tokens: {},
  setTokens: () => {},
  selectedToken: {},
  setSelectedToken: () => {},
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const store = new Store(".settings.dat");
  const navigate = useNavigate();

  const [encryptedWalletInfo, setEncryptedWalletInfo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<TNetwork>(networks[0]);
  const [tokens, setTokens] = useState<TAllTokens>({});
  const [selectedToken, setSelectedToken] = useState<TSeletedToken>({});

  useEffect(() => {
    (async () => {
      const encryptedWalletInfo = await store.get("wallet");
      let tokens: any = (await store.get("tokens")) as string;
      if (tokens) {
        tokens = JSON.parse(tokens);
      } else {
        tokens = {};
      }
      setTokens(tokens);
      setEncryptedWalletInfo(encryptedWalletInfo as string);
      if (encryptedWalletInfo) {
        if (isLogged) {
          navigate("/");
        } else {
          navigate("/login");
        }
      } else {
        navigate("/gettingstart");
      }
    })();
  }, [isLogged]);

  return (
    <WalletContext.Provider
      value={{
        encryptedWalletInfo,
        setEncryptedWalletInfo,
        password,
        setPassword,
        isLogged,
        setIsLogged,
        selectedNetwork,
        setSelectedNetwork,
        tokens,
        setTokens,
        selectedToken,
        setSelectedToken,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
