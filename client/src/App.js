import React from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "components/login";
import ForgotPassword from "components/forgotPassword";
import SignUp from "components/signup";
import ResetPassword from "components/resetPassword";
import { ToastContainer } from "react-toastify";
import Nav from "components/navbar";

function App() {
  const [state, setState] = React.useState(false);

  // const isAuthenticated = () => {
  //   console.log("here");
  //   return JSON.parse(localStorage.getItem("auth") === "true");
  // };

  React.useEffect(() => {
    console.log("here");
    // setState(JSON.parse(localStorage.getItem("auth") === "true"));
  }, []);

  const styles = () =>
    state
      ? "col-span-10 my-4 px-4 overflow-y-auto scroller"
      : "col-span-12 px-5 py-5 h-[100%] overflow-y-auto";

  return (
    <div className="App">
      <BrowserRouter>
        <div className="grid grid-cols-12 h-screen">
          {state && <Nav />}
          <div className={styles()}>
            <Routes>
              {/* <Route
                path="/"
                exact
                element={
                  isAuthenticated() ? (
                    <EventsList />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              /> */}
              {/* <Route
                path="/privacy-policy"
                element={
                  isAuthenticated() ? (
                    <Navigate to="/" replace />
                  ) : (
                    <PrivacyPolicyPage />
                  )
                }
              /> */}
              {/* <Route
                path="/event/:id"
                exact
                element={
                  isAuthenticated() ? (
                    <EventPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="/verify/:token" exact element={<VerifyUser />} />

              <Route
                path="/create-event"
                exact
                element={
                  isAuthenticated() ? (
                    <CreateEvent />
                  ) : (
                    <Navigate to="/login" replace />
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
                path="/profile/:username"
                exact
                element={
                  isAuthenticated() ? (
                    <FollowerProfile />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/my-events"
                exact
                element={
                  isAuthenticated() ? (
                    <RsvpedEvents />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/calendar"
                exact
                element={
                  isAuthenticated() ? (
                    <Calendar />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
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
          </div>
        </div>

        <ToastContainer
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          theme="colored"
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
