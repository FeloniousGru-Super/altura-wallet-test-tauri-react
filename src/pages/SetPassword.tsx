import React from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type Props = {
  isShowPassword: boolean;
  setIsShowPassword: (isShowPassword: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  isShowConfirmPassword: boolean;
  setIsShowConfirmPassword: (isShowConfirmPassword: boolean) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  errMsg: string;
  handleSetPassword: () => void;
};

const SetPassword: React.FC<Props> = ({
  isShowPassword,
  setIsShowPassword,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isShowConfirmPassword,
  setIsShowConfirmPassword,
  errMsg,
  handleSetPassword,
}: Props) => {
  return (
    <Container sx={{ py: 4 }}>
      <Box m={1}>
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
      </Box>
      <Box m={1}>
        <FormControl variant="outlined">
          <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
          <OutlinedInput
            id="confirm-password"
            type={isShowConfirmPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() =>
                    setIsShowConfirmPassword(!isShowConfirmPassword)
                  }
                  edge="end"
                >
                  {isShowConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
      </Box>
      <Typography variant="caption" color={"red"}>
        {errMsg}
      </Typography>
      <Box m={1}>
        <Button
          variant="contained"
          sx={{ fontWeight: "bold" }}
          onClick={handleSetPassword}
          // disabled={password === "" || confirmPassword === ""}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default SetPassword;
