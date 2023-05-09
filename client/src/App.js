import React from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import LoginPage from "components/login";
import ForgotPassword from "components/forgotPassword";
import SignUp from "components/signup";
import ResetPassword from "components/resetPassword";
import { ToastContainer } from "react-toastify";
import Home from "components/Home";
import ReportItem from "components/reportItem";
import { ThemeProvider } from "@mui/material";
import theme from "theme";
import ItemDetails from "components/item";
import Page404 from "components/common/Page404";
import "./App.css";
import Profile from "components/profile";
import PrivacyPolicyPage from "components/common/privacyPolicyPage";

import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import MyActivites from "components/myActivities";

function App() {
  const state = useSelector((state) => state?.userData?.userData);

  // const theme = createTheme({
  //   breakpoints: {
  //     values: {
  //       xs: 0,
  //       sm: 300,
  //       md: 639,
  //       lg: 1023,
  //       xl: 1279,
  //     },
  //   },
  // });

  const isAuthenticated = () => {
    return Object.keys(state).length !== 0 ? true : false;
  };

  return (
    <div className="App h-screen">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              exact
              element={
               <Home />
              }
            />
            <Route
              path="/my-activities"
              exact
              element={
                isAuthenticated() ? (
                  <MyActivites />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/report-item"
              exact
              element={
                isAuthenticated() ? (
                  <ReportItem />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/item/:id"
              exact
              element={
                isAuthenticated() ? (
                  <ItemDetails />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/privacy-policy"
              element={
                isAuthenticated() ? (
                  <Navigate to="/" replace />
                ) : (
                  <PrivacyPolicyPage />
                )
              }
            />
            <Route
              path="/profile"
              exact
              element={
                isAuthenticated() ? (
                  <Profile />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              exact
              path="/signup"
              element={
                isAuthenticated() ? <Navigate to="/" replace /> : <SignUp />
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated() ? <Navigate to="/" replace /> : <LoginPage />
              }
            />
            <Route
              path="/forgot-password"
              element={
                isAuthenticated() ? (
                  <Navigate to="/" replace />
                ) : (
                  <ForgotPassword />
                )
              }
            />
            <Route
              path="/reset/:token"
              exact
              element={
                isAuthenticated() ? (
                  <Navigate to="/login" replace />
                ) : (
                  <ResetPassword />
                )
              }
            />
            <Route path="/404-page" element={<Page404 />} />
            <Route path="*" element={<Navigate to="/404-page" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        theme="colored"
      />
    </div>

  );
}

export default App;
