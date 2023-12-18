import React, { useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import { useStatus } from "../../contexts/Status.context";
import { useWallet } from "../../contexts/Wallet.context";
import utils from "../../utils/utils";

type TShowStatus = "publicKey" | "privateKey" | "phrase";

const AccountDetailModal: React.FC = () => {
  const { password, encryptedWalletInfo } = useWallet();

  const { isAccountDetailModalOpen, setIsAccountDetailModalOpen } = useStatus();
  const [publicKey, setPublicKey] = useState<string>("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showStatus, setShowStatus] = useState<TShowStatus>("publicKey");
  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    setIsShow(false);
    setShowStatus("publicKey");
    setConfirmPassword("");
  }, [isAccountDetailModalOpen]);

  useEffect(() => {
    (async () => {
      try {
        const mnemonic = await utils.getMnemonicFromPassword(
          password,
          encryptedWalletInfo
        );
        const publicKey = await utils.getPublicKey(mnemonic);
        const privateKey = await utils.getPrivateKey(mnemonic);
        setMnemonic(mnemonic);
        setPublicKey(publicKey);
        setPrivateKey(privateKey);
      } catch (error) {}
    })();
  }, [password, encryptedWalletInfo]);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClose = () => {
    setIsAccountDetailModalOpen(false);
  };

  const handleCancel = () => {
    setIsShow(false);
    setShowStatus("publicKey");
    setConfirmPassword("");
  };

  const handleConfirm = () => {
    if (password === confirmPassword) {
      setIsShow(true);
    } else {
      toast.error("Incorrect password!");
    }
  };

  const renderByShowStatus = () => {
    switch (showStatus) {
      case "publicKey":
        return (
          <>
            <Box m={1}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowStatus("phrase");
                  setIsShow(false);
                }}
              >
                Show Phrase
              </Button>
            </Box>
            <Box m={1}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowStatus("privateKey");
                  setIsShow(false);
                }}
              >
                Show private key
              </Button>
            </Box>
          </>
        );
      case "privateKey":
        return (
          <>
            <Box m={1}>
              {isShow ? (
                <TextField
                  value={privateKey.slice(2)}
                  label="Private Key"
                  multiline
                  rows={3}
                  fullWidth
                />
              ) : (
                <TextField
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  label="Password"
                />
              )}
            </Box>
            <Box m={1}>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              {!isShow ? (
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  onClick={handleConfirm}
                >
                  Confirm
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  onClick={() => handleCopyToClipboard(privateKey.slice(2))}
                >
                  Copy to clipboard
                </Button>
              )}
            </Box>
          </>
        );
      case "phrase":
        return (
          <>
            <Box m={1}>
              {isShow ? (
                <TextField
                  value={mnemonic}
                  label="Phrase"
                  multiline
                  rows={3}
                  fullWidth
                />
              ) : (
                <TextField
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  label="Password"
                />
              )}
            </Box>
            <Box m={1}>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              {!isShow ? (
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  onClick={handleConfirm}
                >
                  Confirm
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  onClick={() => handleCopyToClipboard(mnemonic)}
                >
                  Copy to clipboard
                </Button>
              )}
            </Box>
          </>
        );

      default:
        break;
    }
  };

  return (
    <Dialog
      open={isAccountDetailModalOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title" textAlign={"center"}>
        Account Detail
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <Box m={1}>
          <Button
            variant="outlined"
            onClick={() => handleCopyToClipboard(publicKey)}
          >
            {publicKey}
            <ContentCopyIcon sx={{ fontSize: 14, ml: 1 }} />
          </Button>
        </Box>
        {renderByShowStatus()}
      </DialogContent>
    </Dialog>
  );
};

export default AccountDetailModal;
