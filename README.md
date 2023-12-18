# Altura Wallet (React + Typescript + Vite + Tauri)

This is the EVM wallet for Ethereum, Goerli Ethereum testnet made with React, MUI, Vite, Typescript and Tauri.

## Setup project

- Install node and [rust](https://tauri.app/v1/guides/getting-started/prerequisites) on OS.
- Run `npm install` to install node modules for project in the root directory.
- Run `cargo update` to install rust dependencies in the `src-tauri` directory.
- Run `npm run tauri dev` in the root directory for `dev-environment`.
- Run `npm run tauri build` to release execution app.
- Then you can get setup files and running file in `src-tauri/target/release` directory.
- Check `release/altura-wallet.exe` file on Windows OS environment with this.

## Features

### - Create Wallet

- Agree to Altura's term.
- Set password.
- Generate 12 words mnemonic phase.
- Reveal 12 words mnemonic phase.
- Confirm 12 words mnemonic phase.
- Store encrypted wallet data with Password and Mnemonic to uniqu wallet.

### - Import Wallet

- Agree to Altura's term.
- Set password.
- Import 12 words mnemonic phase.
- Store encrypted wallet data with Password and Mnemonic to uniqu wallet.

### - Login Wallet

- Enter password
- Check if mnemonic that is decrypted with Password from encrypted wallet data stored in Tauri Plugin Store is valid.

### - Get Balance of Tokens

- Get the balance of Tokens from blockchain with Selected Network RPC Provider.

### - Import Token and Send Token

- Check if searched token is existed.
- Import the token to the selected network.

### - Send Token

- Send selected token on selected network to other account.

### - View Account Detail

- View Account private key and 12 words phrase with password.

### - Set theme

- Set light or dark theme.

### - Lock wallet

- Lock wallet

## Preview

- ### Getting Start
  ![](./previews/gettingstart.png?raw=true)
- ### Create Wallet
  ![](./previews/createwallet-setpassword.png?raw=true)
  ![](./previews/createwallet-generatephrase.png?raw=true)
  ![](./previews/createwallet-revealphrase.png?raw=true)
  ![](./previews/createwallet-confirmphrase.png?raw=true)
- ### Import Wallet
  ![](./previews/importwallet-setpassword.png?raw=true)
  ![](./previews/importwallet-importphrase.png?raw=true)
- ### Login
  ![](./previews/login.png?raw=true)
- ### Dashboard
  ![](./previews/dashboard.png?raw=true)
  ![](./previews/sendtoken.png?raw=true)
  ![](./previews/accountdetail.png?raw=true)
