import React, { useState } from "react";
import { Box, Button, Checkbox, Container, Typography } from "@mui/material";
import Logo from "../assets/logo.webp";
import { useNavigate } from "react-router-dom";

const GettingStart: React.FC = () => {
  const [isAgreeTerm, setIsAgreeTerm] = useState(false);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" my={1}>
          Let's get started
        </Typography>
        <img src={Logo} />
        <Typography variant="h4" my={1}>
          Welcome to Altura
        </Typography>
      </Container>
      <Container sx={{ py: 4 }}>
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Checkbox
            checked={isAgreeTerm}
            onChange={(e) => setIsAgreeTerm(e.target.checked)}
          />
          <Typography>I agree to Altura's Terms of use.</Typography>
        </Box>
        <Box my={1}>
          <Button
            variant="contained"
            sx={{ px: 4, fontWeight: "bold" }}
            disabled={!isAgreeTerm}
            onClick={() => navigate("/createwallet")}
          >
            Create a new Wallet
          </Button>
        </Box>
        <Box my={1}>
          <Button
            variant="outlined"
            sx={{ px: 4, fontWeight: "bold" }}
            disabled={!isAgreeTerm}
            onClick={() => navigate("/importwallet")}
          >
            Import an exsiting Wallet
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default GettingStart;
