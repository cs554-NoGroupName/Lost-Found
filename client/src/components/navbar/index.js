import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SVGComponent from "components/common/Logo";
import "./styles.css";
import { Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "redux/reducer";

const pages = [
  { name: "Home", route: "/" },
  { name: "Report Item", route: "/report-item" },
];
const settings = [
  { name: "My Profile", route: "/profile", Icon: AccountCircleIcon },
  { name: "My Activites", route: "/My-Activites", Icon: ScatterPlotIcon },
];

function Nav() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.userData?.userData);
  const signOutUser = async () => {
    dispatch(setUserData({ data: {} }));
    localStorage.setItem("token", null);
  };

  const { pathname } = window.location;

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        zIndex: 999,
        backgroundColor: "#1c2536",
        height: "80px",
        boxShadow: "0px 0px 4px 2px #1c2536",
        placeContent: "center",
      }}
    >
      <Container maxWidth="2xl" disableGutters sx={{ padding: "0px 10px" }}>
        <Toolbar disableGutters>
          <div className="xs:hidden sm:hidden md:flex">
            <SVGComponent fillColor="#fff" w="200" h="55" />
          </div>
          {/* {Phone} */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              alignItems: "center",
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                marginLeft: "0px",
                padding: "12px 12px 12px 0px",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(({ name, route }) => (
                <Link to={route} key={name}>
                  <MenuItem key={name} onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      sx={{
                        fontWeight: 600,
                        color: pathname === route ? "#1c2536" : "#868b91",
                        textTransform: "capitalize",
                        fontSize: "1.3rem",
                      }}
                    >
                      {name}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>

            <SVGComponent fillColor="#fff" w="142" h="40" />
          </Box>

          {/* desktop */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              marginLeft: "40px",
            }}
          >
            {pages.map(({ name, route }) => (
              <Link to={route} key={name}>
                <Button
                  key={name}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    display: "block",
                    padding: "2px 10px",
                    marginRight: "10px",
                    "&.MuiButtonBase-root:hover": {
                      backgroundColor: "#ffffff10",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <Typography
                    textAlign="center"
                    sx={{
                      // '&.MuiTypography-root:hover': {
                      //   transform: 'scale(1.1)'
                      // },
                      color: pathname === route ? "#fff" : "#9da4ae",
                      textTransform: "capitalize",
                      fontWeight: pathname === route ? "600" : 500,
                      // fontSize: pathname === route ? '1.3rem':"1.2rem",
                      fontSize: "1.3rem",
                    }}
                  >
                    {name}
                  </Typography>
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, border: "1px solid #fff" }}
              >
                <Avatar
                  alt="user_profile"
                  src={state?.image_url}
                  sx={{ borderRadius: "100px", border: "1px solid #1c2536" }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <div>
                <div className="py-1 px-2 bg-[#95b1b038] border-b border-[#6aa6a647] mb-1">
                  <div className="text-logoBlue text-lg font-bold">Account</div>
                  <div className="text-logoDarkBlue text-lg text-ellipsis overflow-hidden w-[140px] whitespace-nowrap">
                    {state?.firstName} {state?.lastName}
                  </div>
                </div>
                {settings.map(({ name, route, Icon }) => (
                  <MenuItem key={name} onClick={handleCloseUserMenu}>
                    <Link to={route}>
                      <Typography
                        textAlign="center"
                        sx={{
                          bg: "#9da4ae",
                          color: pathname === route ? "#1c2536" : "#45494e",
                          textTransform: "capitalize",
                          fontWeight: pathname === route ? "600" : 500,
                        }}
                      >
                        <Icon />
                        &nbsp;{name}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}

                <Divider />
                <MenuItem key={"sign-out"} onClick={signOutUser}>
                  <Typography
                    textAlign="center"
                    sx={{
                      color: "#0058ff",
                      textTransform: "capitalize",
                      fontWeight: 700,
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ExitToAppIcon />
                    &nbsp;Sign Out
                  </Typography>
                </MenuItem>
              </div>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Nav;
