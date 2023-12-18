import * as ethers from "ethers";
import CryptoJS from "crypto-js";

const generateNewWalletMnemonic = () => {
  const randomWallet = ethers.Wallet.createRandom();
  const mnemonic = randomWallet.mnemonic;
  return mnemonic?.phrase;
};

const getMnemonicFromPassword = async (
  password: string,
  encryptData: string
) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptData, password);
    const mnemonic = bytes.toString(CryptoJS.enc.Utf8);
    return mnemonic.slice(1, -1);
  } catch (error) {
    return "";
  }
};

const checkValidMnemonic = async (mnemonic: string) => {
  try {
    await ethers.Wallet.fromPhrase(mnemonic);
    return true;
  } catch (error) {
    return false;
  }
};

const getPublicKey = async (mnemonic: string) => {
  try {
    const walletMnemonic = await ethers.Wallet.fromPhrase(mnemonic);
    return walletMnemonic.address;
  } catch (error) {
    return "";
  }
};

const getPrivateKey = async (mnemonic: string) => {
  try {
    const walletMnemonic = await ethers.Wallet.fromPhrase(mnemonic);
    return walletMnemonic.privateKey;
  } catch (error) {
    return "";
  }
};

const showWallet = (start: number, end: number, account: any) => {
  return account === undefined || account === null
    ? "..."
    : account.substr(0, start) +
        "..." +
        account.substr(account.length - end, end);
};

const validatePassword = (password: string) => {
  // At least one upper case English letter
  const upperCaseRegex = /(?=.*[A-Z])/;

  // At least one lower case English letter
  const lowerCaseRegex = /(?=.*[a-z])/;

  // At least one digit
  const digitRegex = /(?=.*[0-9])/;

  // At least one special character
  const specialCharRegex = /(?=.*[!@#$%^&+=])/;

  // At least 8 characters
  const eightCharRegex = /^.{8,}$/;

  if (!eightCharRegex.test(password)) {
    return "Error: Password must be at least 8 characters long.";
  }

  if (!lowerCaseRegex.test(password)) {
    return "Error: Password must contain at least one lowercase English letter.";
  }

  if (!upperCaseRegex.test(password)) {
    return "Error: Password must contain at least one uppercase English letter.";
  }

  if (!digitRegex.test(password)) {
    return "Error: Password must contain at least one digit.";
  }

  if (!specialCharRegex.test(password)) {
    return "Error: Password must contain at least one special character.";
  }

  return "Valid password!";
};

export default {
  generateNewWalletMnemonic,
  validatePassword,
  getMnemonicFromPassword,
  checkValidMnemonic,
  getPublicKey,
  getPrivateKey,
  showWallet,
};
