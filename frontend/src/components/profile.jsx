import { Typography } from "@mui/material";
import { green } from "@mui/material/colors";

export default function Profile() {
  return (
    <div>
      <Typography sx={{ color: green[800] }}>
        Welcome to the Farm-Tech eCommerce website for fresh vegetables and
        fruits.
      </Typography>
    </div>
  );
}