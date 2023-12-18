import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useWallet } from "../contexts/Wallet.context";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Logo from "../assets/logo.webp";
import LockIcon from "@mui/icons-material/Lock";
import GridViewIcon from "@mui/icons-material/GridView";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import utils from "../utils/utils";
import { useStatus } from "../contexts/Status.context";
import ThemeSwitch from "../components/UI/ThemeSwitch";
import { useTheme } from "../contexts/Theme.context";
import ManageToken from "./ManageToken";
import { Store } from "tauri-plugin-store-api";

const Dashboard = () => {
  const store = new Store(".settings.dat");
  const { setIsLogged, password, encryptedWalletInfo } = useWallet();
  const { setIsAccountDetailModalOpen } = useStatus();
  const { isDarkMode, setIsDarkMode } = useTheme();

  const [publicKey, setPublicKey] = useState<string>("");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const publicKey = await utils.getPublicKey(
          await utils.getMnemonicFromPassword(password, encryptedWalletInfo)
        );
        setPublicKey(publicKey);
      } catch (error) {}
    })();
  }, [password, encryptedWalletInfo]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(publicKey);
  };

  const handleTheme = async (mode: boolean) => {
    setIsDarkMode(mode);
    try {
      if (mode) {
        await store.set("theme", "dark");
      } else {
        await store.set("theme", "light");
      }
      await store.save();
    } catch (error) {}
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display={"flex"} alignItems={"center"}>
            <img src={Logo} width={30} />
            <Typography fontWeight={"bold"} ml={1}>
              Altura Wallet
            </Typography>
          </Box>
          <Box>
            <Typography
              onClick={handleCopyToClipboard}
              sx={{ cursor: "pointer" }}
            >
              {utils.showWallet(7, 5, publicKey)}
              <ContentCopyIcon sx={{ fontSize: 14, ml: 1 }} />
            </Typography>
          </Box>
          <Box>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  setIsAccountDetailModalOpen(true);
                }}
              >
                <GridViewIcon sx={{ mr: 1 }} /> Account Detail
              </MenuItem>
              <MenuItem>
                <Brightness6Icon sx={{ mr: 1 }} />
                <ThemeSwitch
                  checked={isDarkMode}
                  onChange={() => handleTheme(!isDarkMode)}
                />
              </MenuItem>
              <MenuItem onClick={() => setIsLogged(false)}>
                <LockIcon sx={{ mr: 1 }} />
                Lock
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <ManageToken />
    </Box>
  );
};

export default Dashboard;
