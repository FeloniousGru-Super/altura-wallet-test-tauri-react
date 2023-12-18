import { Box, Button, Container, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

type Props = {
  mnemonic: string;
  confirmPhrase: () => void;
};

const ConfirmSecurePhrase: React.FC<Props> = ({
  mnemonic,
  confirmPhrase,
}: Props) => {
  const [mnemonicArr, setMnemonicArr] = useState<any>({});
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  useEffect(() => {
    if (mnemonic !== "") {
      const mnemonicArr = mnemonic.split(" ");
      const getFourNums = getRandomNumbers();
      let newArr: string[] = [];
      mnemonicArr.forEach((item, index) => {
        if (getFourNums.includes(index)) {
          newArr[index] = "";
        } else {
          newArr[index] = item;
        }
      });
      setMnemonicArr(newArr);
    }
  }, [mnemonic]);

  useEffect(() => {
    let confirmPhrase = Object.keys(mnemonicArr)
      .map((key) => {
        return mnemonicArr[key];
      })
      .join(" ");
    if (confirmPhrase === mnemonic) setIsConfirmed(true);
    else setIsConfirmed(false);
  }, [mnemonicArr]);

  const getRandomNumbers = () => {
    var randomNumbers = [];
    for (var i = 0; i < 4; i++) {
      var num = Math.floor(Math.random() * 12);
      randomNumbers.push(num);
    }
    return randomNumbers;
  };

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
          onClick={() => confirmPhrase()}
          disabled={!isConfirmed}
        >
          Confirm
        </Button>
      </Box>
    </Container>
  );
};

export default ConfirmSecurePhrase;
