import React from "react";
import {
  Stack,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const PhoneInput = ({value, onChange, disabled}) => {
  const [countryCode, setCountryCode] = React.useState("+886");
  const [phoneNumber, setPhoneNumber] = React.useState(value);

  const handleCountryCodeChange = (event) => {
    setCountryCode(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    onChange('phone',event.target.value);
  };

  return (
    <Stack alignItems="center" direction="row" spacing={2}>
      <FormControl sx={{ width: "25%" }}>
        <InputLabel id="country-code-label">國際碼</InputLabel>
        <Select
          labelId="country-code-label"
          id="country-code-select"
          value={countryCode}
          label="Country Code"
          disabled={disabled}
          onChange={handleCountryCodeChange}
        >
          <MenuItem value="+886">+886</MenuItem>
          <MenuItem value="+123">+123</MenuItem>
        </Select>
      </FormControl>
      <TextField
        sx={{ width: "75%" }}
        id="phone-number"
        label="電話"
        type="tel"
        disabled={disabled}
        fullWidth
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
      />
    </Stack>
  );
};

export default PhoneInput;
