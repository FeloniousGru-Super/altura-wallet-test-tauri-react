import React, { useState, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import * as ethers from "ethers";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import { useStatus } from "../../contexts/Status.context";
import { TImportToken, useWallet } from "../../contexts/Wallet.context";
import ERC20TokenABI from "../../constants/abi/IERC20.json";
import { Store } from "tauri-plugin-store-api";

const ImportTokenModal: React.FC = () => {
  const store = new Store(".settings.dat");
  const { selectedNetwork, setTokens } = useWallet();

  const { isImportTokenModalOpen, setIsImportTokenModalOpen } = useStatus();

  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [tokenInfo, setTokenInfo] = useState<TImportToken>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setTokenAddress("");
    setTokenInfo(null);
  }, [isImportTokenModalOpen]);

  useEffect(() => {
    handleCheckToken();
  }, [tokenAddress]);

  const handleClose = () => {
    setIsImportTokenModalOpen(false);
  };

  const handleCheckToken = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider(selectedNetwork.rpcUrl);
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20TokenABI,
        provider
      );

      const tokenSymbol = await tokenContract.symbol();
      const tokenName = await tokenContract.name();
      const tokenDecimals = await tokenContract.decimals();
      setTokenInfo({
        address: tokenAddress,
        symbol: tokenSymbol,
        name: tokenName,
        decimals: Number(tokenDecimals),
      });
    } catch (error) {
      console.error("Error importing token:", error);
      setTokenInfo(null);
    }
    setIsLoading(false);
  };

  const handleImportToken = async () => {
    setIsLoading(true);
    try {
      let tokens: any = (await store.get("tokens")) as string;
      if (tokens) {
        tokens = JSON.parse(tokens);
      } else {
        tokens = {};
      }
      const newTokens = {
        ...tokens,
        [selectedNetwork.chainId]: {
          ...tokens[selectedNetwork.chainId],
          [tokenAddress]: tokenInfo,
        },
      };
      await store.set("tokens", JSON.stringify(newTokens));
      await store.save();
      setTokens(newTokens);
      toast.success("Added token!");
      handleClose();
    } catch (error) {}
    setIsLoading(false);
  };

  return (
    <Dialog
      open={isImportTokenModalOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title" textAlign={"center"}>
        Import Token
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <Box m={1}>
          <TextField
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            label="Token Address"
          />
        </Box>
        {tokenInfo && (
          <Box m={1}>
            <Typography>
              {tokenInfo.name} ({tokenInfo.symbol})
            </Typography>
          </Box>
        )}
        <Box m={1}>
          <LoadingButton
            onClick={handleImportToken}
            variant="contained"
            disabled={!tokenInfo}
            loading={isLoading}
          >
            Import Token
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTokenModal;
