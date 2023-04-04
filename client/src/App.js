import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "components/login";

function App() {
  const isAuthenticated = () => {
    console.log("here");
    return JSON.parse(localStorage.getItem("auth") === "true");
  };

  return (
    <div className="App">
      <BrowserRouter>
        <div className="grid grid-cols-12 h-screen">
          {/* {isAuthenticated() && <Nav />} */}
          {/* <div className={styles()}> */}
          <div>
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
              />
              <Route
                exact
                path="/signup"
                element={
                  isAuthenticated() ? <Navigate to="/" replace /> : <SignUp />
                }
              /> */}
              <Route
                path="/login"
                element={
                  isAuthenticated() ? (
                    <Navigate to="/" replace />
                  ) : (
                    <LoginPage />
                  )
                }
              />
              {/* <Route
                path="/forgot-password"
                element={
                  isAuthenticated() ? (
                    <Navigate to="/" replace />
                  ) : (
                    <ForgotPassword />
                  )
                }
              /> */}
              {/* NOTE: do we need a 404 Not Found page or redirect to login if not logged-in */}
              <Route
                path="*"
                element={
                  isAuthenticated() ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </div>
        </div>

        {/* <ToastContainer
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          theme="colored"
        /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
