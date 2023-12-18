import {
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Tab,
  Divider,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect, useState, useMemo } from "react";
import * as ethers from "ethers";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  TNetwork,
  TTokens,
  networks,
  useWallet,
} from "../contexts/Wallet.context";
import utils from "../utils/utils";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { toast } from "react-toastify";

import ERC20TokenABI from "../constants/abi/IERC20.json";
import { useStatus } from "../contexts/Status.context";

const ManageToken: React.FC = () => {
  const {
    password,
    encryptedWalletInfo,
    selectedNetwork,
    setSelectedNetwork,
    tokens,
    selectedToken,
    setSelectedToken,
  } = useWallet();

  const { setIsImportTokenModalOpen } = useStatus();

  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");

  const [ethBalance, setEthBalance] = useState<string>("0");
  const [tabValue, setTabValue] = React.useState("1");

  const [tokensBalance, setTokensBalance] = useState<TTokens>({});

  const [sendAddress, setSendAddress] = useState<string>("");
  const [sendAmount, setSendAmount] = useState<number>(0);
  const [gasPrice, setGasPrice] = useState<string>("0");
  const [errMsg, setErrMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const selectedTokenInfo = useMemo(() => {
    if (
      selectedToken[selectedNetwork.chainId] &&
      selectedToken[selectedNetwork.chainId] != "0x"
    ) {
      return tokens[selectedNetwork.chainId][
        selectedToken[selectedNetwork.chainId]
      ];
    }
    return null;
  }, [selectedToken, selectedNetwork, tokens]);

  useEffect(() => {
    (async () => {
      try {
        const mnemonic = await utils.getMnemonicFromPassword(
          password,
          encryptedWalletInfo
        );
        const publicKey = await utils.getPublicKey(mnemonic);
        const privateKey = await utils.getPrivateKey(mnemonic);
        setPublicKey(publicKey);
        setPrivateKey(privateKey);
      } catch (error) {}
    })();
  }, [password, encryptedWalletInfo]);

  useEffect(() => {
    getEthBalance();
    setSelectedToken({});
    setTabValue("1");
  }, [publicKey, selectedNetwork]);

  useEffect(() => {
    getTokensBalances();
  }, [publicKey, selectedNetwork, tokens]);

  useEffect(() => {
    if (
      selectedToken[selectedNetwork.chainId] &&
      selectedToken[selectedNetwork.chainId] === "0x"
    ) {
      getGasEstimateEth();
    } else {
      getGasEstimateERC20();
    }
  }, [sendAddress, sendAmount, selectedToken]);

  const getEthBalance = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(selectedNetwork.rpcUrl);
      const balance = await provider.getBalance(publicKey);
      setEthBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error retrieving ETH balance:", error);
    }
  };

  const getTokensBalances = () => {
    Object.keys(tokens[selectedNetwork.chainId] || {}).forEach(
      (tokenAddress) => {
        getTokenBalance(tokens[selectedNetwork.chainId][tokenAddress].address);
      }
    );
  };

  const getTokenBalance = async (tokenAddress: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(selectedNetwork.rpcUrl);
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20TokenABI,
        provider
      );
      const balance = await tokenContract.balanceOf(publicKey);
      const temp = {
        ...tokensBalance,
        [tokenAddress]: {
          ...tokensBalance[tokenAddress],
          balance: ethers.formatUnits(
            balance,
            tokens[selectedNetwork.chainId][tokenAddress].decimals
          ),
        },
      };
      setTokensBalance(temp);
    } catch (error) {
      console.error("Error retrieving token balance:", error);
    }
  };

  const refreshBalances = () => {
    getEthBalance();
    getTokensBalances();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectNetwork = (network: TNetwork) => {
    handleClose();
    setSelectedNetwork(network);
  };

  const handleTabValueChange = (_: React.SyntheticEvent, newValue: string) => {
    if (selectedToken[selectedNetwork.chainId]) {
      setTabValue(newValue);
    } else {
      toast.error("Select Token first!");
    }
  };

  const handleSelectToken = (tokenAddress: string) => {
    setSelectedToken({
      [selectedNetwork.chainId]: tokenAddress,
    });
    setTabValue("2");
  };

  const getGasEstimateEth = async () => {
    setErrMsg("");
    try {
      const provider = new ethers.JsonRpcProvider(selectedNetwork.rpcUrl);

      const wallet = new ethers.Wallet(privateKey, provider);

      let transaction = {
        to: sendAddress,
        value: ethers.parseEther(String(sendAmount)),
      };

      const gasEstimate = await wallet.estimateGas(transaction);
      setGasPrice(gasEstimate.toString());
    } catch (e: any) {
      setErrMsg(e.message);
    }
  };

  const getGasEstimateERC20 = async () => {
    setErrMsg("");
    try {
      const provider = new ethers.JsonRpcProvider(selectedNetwork.rpcUrl);

      const wallet = new ethers.Wallet(privateKey, provider);

      const tokenAddress = selectedToken[selectedNetwork.chainId];
      const recipient = sendAddress;

      const contract = new ethers.Contract(tokenAddress, ERC20TokenABI, wallet);

      const numberOfTokens = ethers.parseUnits(
        String(sendAmount),
        selectedTokenInfo?.decimals
      );

      const gasEstimate = await contract.transfer.estimateGas(
        recipient,
        numberOfTokens
      );
      setGasPrice(gasEstimate.toString());
    } catch (e: any) {
      setErrMsg(e.message);
    }
  };

  const handleSend = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider(selectedNetwork.rpcUrl);
      const wallet = new ethers.Wallet(privateKey, provider);
      if (
        selectedToken[selectedNetwork.chainId] &&
        selectedToken[selectedNetwork.chainId] === "0x"
      ) {
        let transaction: any = {
          to: sendAddress,
          value: ethers.parseEther(String(sendAmount)),
        };
        const txResult = await wallet.sendTransaction(transaction);
        await txResult.wait();
        toast.success(
          `Transaction successfully! https://goerli.etherscan.io/tx/${txResult.hash}`,
          {
            onClick: () => {
              window.open(`https://goerli.etherscan.io/tx/${txResult.hash}`);
            },
          }
        );
      } else {
        const tokenAddress = selectedToken[selectedNetwork.chainId];
        const recipient = sendAddress;

        const contract = new ethers.Contract(
          tokenAddress,
          ERC20TokenABI,
          wallet
        );

        const numberOfTokens = ethers.parseUnits(
          String(sendAmount),
          selectedTokenInfo?.decimals
        );

        const txResponse = await contract.transfer(recipient, numberOfTokens);
        await txResponse.wait();
        toast.success(
          `Transaction successfully! https://goerli.etherscan.io/tx/${txResponse.hash}`,
          {
            onClick: () => {
              window.open(`https://goerli.etherscan.io/tx/${txResponse.hash}`);
            },
          }
        );
      }
      getEthBalance();
      getTokenBalance(selectedToken[selectedNetwork.chainId]);
    } catch (error: any) {
      toast.error(error.message);
    }

    setIsLoading(false);
  };

  return (
    <Box mt={2}>
      <Container sx={{ textAlign: "center" }}>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          variant="outlined"
        >
          {selectedNetwork.name}
          <KeyboardArrowDownIcon />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {networks.map((network, index) => (
            <MenuItem onClick={() => handleSelectNetwork(network)} key={index}>
              {network.name}
            </MenuItem>
          ))}
        </Menu>
        <Box my={2}>
          <Typography>
            {ethBalance} ETH{" "}
            <Tooltip title="Reload balance">
              <RefreshIcon
                sx={{ fontSize: 16, cursor: "pointer" }}
                onClick={getEthBalance}
              />
            </Tooltip>
          </Typography>
        </Box>
        <Box my={2}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleTabValueChange}
                aria-label="lab API tabs example"
                variant="fullWidth"
              >
                <Tab
                  label={
                    <Typography variant="body2" mr={1}>
                      Tokens
                    </Typography>
                  }
                  value="1"
                />
                <Tab
                  label={
                    <Typography variant="body2" mr={1}>
                      Send
                    </Typography>
                  }
                  value="2"
                />
              </TabList>
            </Box>

            <TabPanel value="1" sx={{ p: 0 }}>
              <Box
                onClick={() => handleSelectToken("0x")}
                sx={{ cursor: "pointer" }}
              >
                <Typography textAlign={"left"} py={2}>
                  Ethereum ({ethBalance} ETH)
                </Typography>
                <Divider />
              </Box>
              {Object.keys(tokens[selectedNetwork.chainId] || {}).map(
                (tokenAddress: string, index: number) => (
                  <Box
                    key={index}
                    onClick={() => handleSelectToken(tokenAddress)}
                    sx={{ cursor: "pointer" }}
                  >
                    <Typography textAlign={"left"} py={2}>
                      {tokens[selectedNetwork.chainId][tokenAddress].name} (
                      {tokensBalance[tokenAddress]?.balance || "0.0"}&nbsp;
                      {tokens[selectedNetwork.chainId][tokenAddress].symbol})
                    </Typography>
                    <Divider />
                  </Box>
                )
              )}
              <Box my={2}>
                <Button variant="outlined" onClick={() => refreshBalances()}>
                  <RefreshIcon />
                </Button>
              </Box>
              <Box my={2}>
                <Button
                  variant="outlined"
                  onClick={() => setIsImportTokenModalOpen(true)}
                >
                  Import token
                </Button>
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box m={1}>
                <Typography>
                  {selectedToken[selectedNetwork.chainId] &&
                  selectedToken[selectedNetwork.chainId] === "0x"
                    ? `Ethereum (${ethBalance} ETH)`
                    : selectedTokenInfo &&
                      `${selectedTokenInfo.name} (${
                        tokensBalance[selectedTokenInfo.address]
                          ? tokensBalance[selectedTokenInfo.address].balance
                          : "0.0"
                      } ${selectedTokenInfo.symbol})`}
                </Typography>
              </Box>
              <Box m={2}>
                <TextField
                  type="text"
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                  label="Send to"
                />
              </Box>
              <Box m={2}>
                <TextField
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(Number(e.target.value))}
                  label="Send amount"
                />
              </Box>
              <Box m={2}>
                <Typography>
                  Gas Fee: {sendAddress == "" || sendAmount == 0 ? 0 : gasPrice}{" "}
                  wei
                </Typography>
              </Box>
              <Box m={2}>
                <Typography color={"red"} variant="caption">
                  {errMsg}
                </Typography>
              </Box>
              <Box m={2}>
                <LoadingButton
                  variant="contained"
                  onClick={handleSend}
                  disabled={
                    sendAddress == "" || sendAmount == 0 || errMsg != ""
                  }
                  loading={isLoading}
                >
                  Send
                </LoadingButton>
              </Box>
            </TabPanel>
          </TabContext>
        </Box>
      </Container>
    </Box>
  );
};

export default ManageToken;
