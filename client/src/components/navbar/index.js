import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
import firebase from "firebase/compat/app";

const pages = [
  { name: "Home", route: "/" },
  { name: "Report Item", route: "/report-item" },
];
const settings = ["Profile", "My Activites"];

function Nav() {
  // const auth = getAuth(firebaseApp);
  const navigate = useNavigate();
  const signOutUser = async () => {
    firebase
      .auth()
      .signOut()
      .then((res) => console.log({ res }))
      .catch((err) => console.log({ err }));
    localStorage.setItem("token", null);
    handleCloseUserMenu();
    navigate("/login");
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
      }}
    >
      <Container maxWidth="2xl">
        <Toolbar disableGutters>
          <div className="xs:hidden sm:hidden md:flex">
            <SVGComponent fillColor="#fff" w="200" h="55" />
          </div>

          {/* desktop */}
          <Box
            sx={{
              marginLeft: "10px",
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
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
                <MenuItem
                  key={name}
                  onClick={handleCloseNavMenu}
                  sx={{
                    color: pathname === route ? "#367272" : "black",
                    fontWeight: pathname === route ? 700 : 500,
                  }}
                >
                  <Link to={route}>
                    <Typography
                      textAlign="center"
                      sx={
                        {
                          // color: pathname === route ? 'white' : 'logoBlue',
                          // fontWeight: pathname === route ? 700 : 500,
                        }
                      }
                    >
                      {name}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>

            <SVGComponent fillColor="#fff" w="142" h="40" />
          </Box>

          {/* phone */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(({ name, route }) => (
              <Button
                key={name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link to={route}>
                  <Typography
                    textAlign="center"
                    sx={{
                      color: "white",
                      textDecoration: pathname === route ? "underline" : "none",
                      fontWeight: pathname === route ? "700" : 500,
                    }}
                  >
                    {name}
                  </Typography>
                </Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}

              <Divider />
              <MenuItem key={"sign-out"} onClick={signOutUser}>
                <Typography textAlign="center">Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    // <div className="max-w-[280px] flex flex-col justify-between pl-2 pr-4 pt-8 pb-2 text-[#ffffff] border-r-logoBlue border-r-2 col-span-2 bg-logoBlue">
    //   <div>
    //     <div className="h-20 pl-4 flex items-center text-ellipsis overflow-hidden whitespace-nowrap">
    //       {/* <img src={HomepageLogo} alt="HomepageLogo" /> */}
    //       <svg
    //         style={{ margin: "0px -25px -15px" }}
    //         viewBox="0 0 500 500"
    //         version="1.1"
    //         id="svg_null"
    //         width={100}
    //         height={100}
    //       >
    //         <defs>
    //           <linearGradient
    //             x1="50%"
    //             y1="25.963%"
    //             x2="50%"
    //             y2="100%"
    //             id="linearGradient-1"
    //           >
    //             <stop stopColor="#FEFEFE" offset="0%" />
    //             <stop stopColor="#D2D4D5" offset="100%" />
    //           </linearGradient>
    //           <linearGradient
    //             x1="50%"
    //             y1="0%"
    //             x2="50%"
    //             y2="100%"
    //             id="linearGradient-2"
    //           >
    //             <stop stopColor="#D4D5D6" offset="0%" />
    //             <stop stopColor="#FAFBFB" offset="100%" />
    //           </linearGradient>
    //           <linearGradient
    //             x1="71.7%"
    //             y1="37.738%"
    //             x2="0%"
    //             y2="100%"
    //             id="linearGradient-3"
    //           >
    //             <stop stopColor="#FEFEFE" offset="0%" />
    //             <stop stopColor="#D2D4D5" offset="100%" />
    //           </linearGradient>
    //           <linearGradient
    //             x1="112.505%"
    //             y1="100%"
    //             x2="25.798%"
    //             y2="100%"
    //             id="linearGradient-4"
    //           >
    //             <stop stopColor="#FDFDFD" offset="0%" />
    //             <stop stopColor="#D5D7D8" offset="100%" />
    //           </linearGradient>
    //         </defs>
    //         <g
    //           id="root"
    //           stroke="none"
    //           strokeWidth="1"
    //           fill="none"
    //           fillRule="evenodd"
    //         >
    //           <rect
    //             id="background.accent"
    //             fill=""
    //             x="0"
    //             y="0"
    //             width="500"
    //             height="500"
    //           />
    //           <g id="shape" transform="translate(150.000000, 99.000000)">
    //             <polygon
    //               fill="url(#linearGradient-1)"
    //               points="158.821 19.769 40.206 19.769 40.206 39.538 178.59 39.538 178.59 197.692 198.359 177.923 198.359 19.769"
    //             />
    //             <polygon
    //               fill="url(#linearGradient-2)"
    //               points="158.821 39.538 158.821 177.923 .667 177.923 20.436 197.692 139.052 197.692 178.59 197.692 178.59 158.154 178.59 39.538"
    //             />
    //             <polygon
    //               fill="url(#linearGradient-3)"
    //               points="20.436 0 .667 19.769 .667 138.384 .667 177.923 40.206 177.923 158.821 177.923 158.821 158.154 20.436 158.154"
    //             />
    //             <polygon
    //               fill="url(#linearGradient-4)"
    //               points="20.436 0 20.436 39.538 20.436 158.154 40.206 158.154 40.206 19.769 198.359 19.769 178.59 0"
    //             />
    //             <polygon
    //               fill="#C8C8C8"
    //               points="158.821 47.226 178.59 47.226 178.59 39.538 158.821 39.538"
    //             />
    //           </g>
    //         </g>
    //       </svg>
    //       <span className="text-3xl flex items-center"> UInvite</span>
    //     </div>

    //     <div>
    //       {navOptions.map((item, key) => (
    //         <div
    //           key={key}
    //           className="cursor-pointer flex items-center w-full group pl-4 pr-6 py-4 my-2 text-ellipsis overflow-hidden whitespace-nowrap rounded-full hover:bg-[#0000001f] hover:border-1 hover:shadow-[#000] hover:font-medium"
    //           onClick={() => navigate(item?.path)}
    //         >
    //           <div className="group-hover:scale-110">
    //             <item.icon />
    //           </div>
    //           <span className="ml-2 text-lg">{item.name}</span>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    //   <div>
    //     <Divider />
    //     <div
    //       className="flex items-center group w-full pl-4 pr-6 py-4 my-3 text-ellipsis overflow-hidden whitespace-nowrap rounded-full hover:bg-[#0000001f] hover:border-1 hover:shadow-[#000] hover:font-medium cursor-pointer"
    //       onClick={signOutUser}
    //     >
    //       <div className="group-hover:scale-110">
    //         <LogoutIcon />
    //       </div>
    //       <span className="ml-2 sm:invisible md:visible">Sign out</span>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Nav;
