import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTheme } from "../contexts/Theme.context";
import { toast } from "react-toastify";

type Props = {
  mnemonic: string;
  goToConfirmSecretPhrase: () => void;
};

const SecureWallet: React.FC<Props> = ({
  mnemonic,
  goToConfirmSecretPhrase,
}: Props) => {
  const { isDarkMode } = useTheme();
  const mnemonicArr = mnemonic.split(" ");
  const [isReveal, setIsReveal] = useState<boolean>(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic);
    toast.success("Copy successfully!");
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box position={"relative"}>
        <Grid container spacing={2}>
          {mnemonicArr.map((item: string, index: number) => (
            <Grid item sm={4} xs={6} md={3} key={index}>
              <TextField
                id="outlined-basic"
                label={index + 1}
                variant="outlined"
                value={item}
              />
            </Grid>
          ))}
        </Grid>
        <Typography
          mt={2}
          sx={{ cursor: "pointer" }}
          onClick={() => handleCopyToClipboard()}
        >
          Copy to Clipboard <ContentCopyIcon sx={{ fontSize: 14 }} />
        </Typography>
        {!isReveal && (
          <Box
            position={"absolute"}
            top={0}
            left={0}
            right={0}
            bottom={0}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
              bgcolor: isDarkMode ? "white" : "black",
              color: !isDarkMode ? "white" : "black",
            }}
          >
            <Box>
              <VisibilityIcon />
              <Typography>Make sure nobody is looking</Typography>
            </Box>
          </Box>
        )}
      </Box>
      <Box m={2}>
        <Button
          variant="contained"
          sx={{ px: 4, fontWeight: "bold" }}
          onClick={() => {
            isReveal ? goToConfirmSecretPhrase() : setIsReveal(true);
          }}
        >
          {isReveal ? "Next" : "Reveal Secret Recovery Phrase"}
        </Button>
      </Box>
    </Container>
  );
};

export default SecureWallet;
