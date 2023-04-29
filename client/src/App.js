import React from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import LoginPage from "components/login";
import ForgotPassword from "components/forgotPassword";
import SignUp from "components/signup";
import ResetPassword from "components/resetPassword";
import { ToastContainer } from "react-toastify";
import Home from "components/Home";
import ReportItem from "components/reportItem";
import { AuthProvider } from "./firebase/auth";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material";

function App() {
  const [state, setState] = React.useState(false);
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 300,
        md: 639,
        lg: 1023,
        xl: 1279,
      },
    },
  });
  // const isAuthenticated = () => {
  //   console.log("here");
  //   return JSON.parse(localStorage.getItem("auth") === "true");
  // };

  React.useEffect(() => {
    console.log("here", window.location.pathname);
    // setState(JSON.parse(localStorage.getItem("auth") === "true"));
  }, []);

  return (
    <div className="App h-screen">
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/report-item" exact element={<ReportItem />} />
              {/*
              <Route
                path="/invites"
                exact
                element={
                  isAuthenticated() ? (
                    <InvitedEvents />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              /> */}
              <Route
                exact
                path="/signup"
                element={state ? <Navigate to="/" replace /> : <SignUp />}
              />
              <Route
                path="/login"
                // element={state ? <Navigate to="/" replace /> : <LoginPage />}
                element={<LoginPage />}
              />
              <Route
                path="/forgot-password"
                element={
                  state ? <Navigate to="/" replace /> : <ForgotPassword />
                }
              />
              <Route
                path="/reset/:token"
                exact
                element={
                  state ? <Navigate to="/login" replace /> : <ResetPassword />
                }
              />
              <Route
                path="*"
                element={
                  state ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>

            <ToastContainer
              autoClose={3000}
              hideProgressBar={true}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              theme="colored"
            />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </div>
    </Router>

  );
}

export default App;
