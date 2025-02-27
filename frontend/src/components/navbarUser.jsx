import * as React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { green } from "@mui/material/colors";

const drawerWidth = 150;
const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Cart", path: "/showcart" },
  { label: "Profile", path: "/profile", icon: <AccountCircleIcon /> },
];

function Navbar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, color: green[700] }}>
        FarmTech
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              component={Link}
              to={item.path}
            >
              {item.icon && (
                <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: "1.5rem" } })}
                </Box>
              )}
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", mb: 0 }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{ backgroundColor: green[600], color: "white" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: 45, flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            FarmTech
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block"} }}>
            {navItems.map((item) => 
              item.icon ? (
                <IconButton
                  key={item.path}
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: green[700] },
                    marginRight: "10px",
                  }}
                  component={Link}
                  to={item.path}
                  aria-label={item.label}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: "1.75rem" } })}
                </IconButton>
              ) : (
                <Button
                  key={item.label}
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: green[700] },
                    fontSize: "18px",
                    marginRight: "15px",
                  }}
                  component={Link}
                  to={item.path}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: green[100],
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;