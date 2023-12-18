import { Box, Button, Container, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import utils from "../utils/utils";

type Props = {
  handleImportPhrase: (mnemonic: string) => void;
};

const ImportPhrase: React.FC<Props> = ({ handleImportPhrase }: Props) => {
  const [mnemonicArr, setMnemonicArr] = useState<any>({});
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  useEffect(() => {
    let newArr: string[] = [];
    for (let i = 0; i < 12; i++) {
      newArr[i] = "";
    }
    setMnemonicArr(newArr);
  }, []);

  useEffect(() => {
    let importPhrase = Object.keys(mnemonicArr)
      .map((key) => {
        return mnemonicArr[key];
      })
      .join(" ");
    (async () => {
      if (await utils.checkValidMnemonic(importPhrase)) {
        setIsConfirmed(true);
      } else {
        setIsConfirmed(false);
      }
    })();
  }, [mnemonicArr]);

  const setItem = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number
  ) => {
    setMnemonicArr((prevArr: any) => {
      let newArr = [...prevArr];
      newArr[index] = e.target.value;
      return newArr;
    });
  };

  const importPhrase = () => {
    let importPhrase = Object.keys(mnemonicArr)
      .map((key) => {
        return mnemonicArr[key];
      })
      .join(" ");

    handleImportPhrase(importPhrase);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box position={"relative"}>
        <Grid container spacing={2}>
          {Object.keys(mnemonicArr).map((key: string, index: number) => (
            <Grid item sm={4} xs={6} md={3} key={index}>
              <TextField
                id="outlined-basic"
                label={index + 1}
                variant="outlined"
                value={mnemonicArr[key]}
                onChange={(e) => setItem(e, index)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box m={2}>
        <Button
          variant="contained"
          sx={{ px: 4, fontWeight: "bold" }}
          disabled={!isConfirmed}
          onClick={() => importPhrase()}
        >
          Import
        </Button>
      </Box>
    </Container>
  );
};

export default ImportPhrase;
