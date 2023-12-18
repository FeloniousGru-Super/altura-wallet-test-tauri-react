import React, { useEffect, useState } from "react";
import { Store } from "tauri-plugin-store-api";
import {
  Box,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import Logo from "../assets/logo.webp";
import utils from "../utils/utils";
import SetPassword from "./SetPassword";
import SecureWallet from "./SecureWallet";
import ConfirmSecurePhrase from "./ConfirmSecurePhrase";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import { useWallet } from "../contexts/Wallet.context";

const steps = [
  "Set Password",
  "Secure wallet",
  "Confirm secret recovery phrase",
];

const CreateWallet: React.FC = () => {
  const store = new Store(".settings.dat");

  const { setPassword: setUserPassword, setIsLogged } = useWallet();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [errMsg, setErrMsg] = useState<string>("");

  const [mnemonic, setMnemonic] = useState("");

  useEffect(() => {}, []);

  const handleSetPassword = () => {
    if (password != confirmPassword) {
      setErrMsg("Incorrect confirm password.");
    } else if (utils.validatePassword(password) !== "Valid password!") {
      setErrMsg(utils.validatePassword(password));
    } else {
      setErrMsg("");
      setActiveStep(activeStep + 1);
      const mnemonic = utils.generateNewWalletMnemonic();
      toast.success("Set password!");
      if (mnemonic) setMnemonic(mnemonic);
    }
  };

  const goToConfirmSecretPhrase = () => {
    setActiveStep(activeStep + 1);
  };

  const confirmPhrase = async () => {
    try {
      const encryptedWalletInfo = CryptoJS.AES.encrypt(
        JSON.stringify(mnemonic),
        password
      ).toString();
      await store.set("wallet", encryptedWalletInfo);
      await store.save();
      setUserPassword(password);
      toast.success("Wallet created!");
      setIsLogged(true);
    } catch (error) {}
  };

  const renderByStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <SetPassword
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isShowPassword={isShowPassword}
            setIsShowPassword={setIsShowPassword}
            isShowConfirmPassword={isShowConfirmPassword}
            setIsShowConfirmPassword={setIsShowConfirmPassword}
            errMsg={errMsg}
            handleSetPassword={handleSetPassword}
          />
        );
      case 1:
        return (
          <SecureWallet
            mnemonic={mnemonic}
            goToConfirmSecretPhrase={goToConfirmSecretPhrase}
          />
        );
      case 2:
        return (
          <ConfirmSecurePhrase
            mnemonic={mnemonic}
            confirmPhrase={confirmPhrase}
          />
        );

      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: "100vh",
      }}
    >
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" my={1}>
          Create a new wallet
        </Typography>
        <img src={Logo} />
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Container>
      {renderByStep()}
    </Box>
  );
};

export default CreateWallet;
