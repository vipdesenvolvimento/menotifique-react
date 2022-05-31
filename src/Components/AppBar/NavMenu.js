import "./NavMenu.css";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline"
import React, { useContext, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import StoreContext from "../Store/Context";

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import routes from "../../routes";

import AccountCircle from "@mui/icons-material/AccountCircle";
import { NavLink } from "react-router-dom";

const NavMenu = () => {
  const { token, setToken } = useContext(StoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    setToken(null);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {routes.map((prop, index) => (
          <NavLink
              key={index}
              to={prop.layout + prop.path}
              style={{textDecoration: 'none', color: '#000'}}
            >

            <ListItem button key={prop.name}>
              <ListItemIcon>
                <prop.icon />
              </ListItemIcon>
              <ListItemText primary={prop.name} />
            </ListItem>
            
          </NavLink>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#00448C",
        borderBottom: "5px solid #8FBC2D",
      }}
    >
      <AppBar position="static" color="transparent">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            arial-label="menu"
            sx={{ mr: 2, color: "#fff" }}
            onClick={toggleDrawer("left", true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 1 }}>
            <img
              src={"https://assine.vipbrtelecom.com.br/_next/static/images/logo-branco-2e4d1ff1f826792e878e8b477a4cc03e.svg"}
              alt={"Vipbrtelecom"}
              style={{ maxWidth: "60px", width: "100%" }}
            />
          </Typography>
          {token && (
            <div>
              <IconButton
                size="large"
                arial-label="conta do usuário atual"
                arial-controls="menu-appbar"
                arial-haspopup="true"
                onClick={handleMenu}
                sx={{ color: "#fff" }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={logout}>Sair</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      
      <CssBaseline />
      <SwipeableDrawer
        variant="temporary"
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
        onOpen={toggleDrawer("left", true)}
      >
        {list("left")}
      </SwipeableDrawer>
    </Box>
  );
};

export default NavMenu;
