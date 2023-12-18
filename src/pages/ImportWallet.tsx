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
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import { useWallet } from "../contexts/Wallet.context";
import ImportPhrase from "./ImportPhrase";

const steps = ["Set Password", "Import Phrase"];

const ImportWallet: React.FC = () => {
  const store = new Store(".settings.dat");

  const { setPassword: setUserPassword, setIsLogged } = useWallet();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {}, []);

  const handleSetPassword = () => {
    if (password != confirmPassword) {
      setErrMsg("Incorrect confirm password.");
    } else if (utils.validatePassword(password) !== "Valid password!") {
      setErrMsg(utils.validatePassword(password));
    } else {
      setErrMsg("");
      setActiveStep(activeStep + 1);
      toast.success("Set password!");
    }
  };

  const handleImportPhrase = async (mnemonic: string) => {
    try {
      const encryptedWalletInfo = CryptoJS.AES.encrypt(
        JSON.stringify(mnemonic),
        password
      ).toString();
      await store.set("wallet", encryptedWalletInfo);
      await store.save();
      setUserPassword(password);

      toast.success("Wallet imported!");
      // navigate("/");
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
        return <ImportPhrase handleImportPhrase={handleImportPhrase} />;

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
        height: "100vh",
      }}
    >
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" my={1}>
          Import a wallet
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

export default ImportWallet;
