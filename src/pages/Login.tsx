import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useWallet } from "../contexts/Wallet.context";
import Logo from "../assets/logo.webp";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import utils from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { encryptedWalletInfo, setIsLogged, password, setPassword } =
    useWallet();
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  useEffect(() => {
    setPassword("");
  }, []);

  const handleLogin = async () => {
    if (
      await utils.checkValidMnemonic(
        await utils.getMnemonicFromPassword(password, encryptedWalletInfo)
      )
    ) {
      toast.success("Login Successfully!");
      setIsLogged(true);
      navigate("/");
    } else {
      toast.error("Incorrect Password!");
    }
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Container sx={{ py: 4 }}>
        <img src={Logo} />
        <Typography variant="h4" my={1}>
          Welcome to Altura
        </Typography>
      </Container>
      <Container sx={{ py: 4 }}>
        <FormControl variant="outlined">
          <InputLabel htmlFor="new-password">Password</InputLabel>
          <OutlinedInput
            id="new-password"
            type={isShowPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                  edge="end"
                >
                  {isShowPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Box m={1}>
          <Button
            variant="contained"
            sx={{ fontWeight: "bold" }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
