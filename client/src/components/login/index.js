import React from "react";
import { Divider, TextField } from "@mui/material";
import { emailValidation, passwordValidation } from "utils/helper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import SVGComponent from "../common/Logo";
import { login } from "../../utils/apis/auth";
import { toast } from "react-toastify";
import Loading from "../common/Loading";
import { useNavigate } from "react-router";
import firebase from "firebase/compat/app";
import "./styles.css";
import { AuthContext } from "../../FirebaseUtils/authenticate";

function Login() {
  const [currentUser, setCurrentUser] = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState({ email: "", password: "" });
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);
  const [errors, setErrors] = React.useState({ email: false, password: false });
  const [loading, setLoading] = React.useState(false);

  const setError = (name) => {
    setErrors({ ...errors, [name]: true });
  };

  const removeError = (name) => {
    const errorsObj = errors;
    delete errorsObj[name];
    setErrors(errorsObj);
  };

  const setValues = (name, value) => {
    setUserData({ ...userData, [name]: value });
  };

  // React.useEffect(() => {
  //   if (currentUser !== null) navigate("/");
  // }, [currentUser, navigate]);

  const validateData = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password } = userData;

    let errorObj = {};
    if (!emailValidation(email)) errorObj.email = true;

    if (!passwordValidation(password)) errorObj.password = true;

    setErrors(errorObj);

    if (Object.keys(errorObj).length === 0) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          firebase
            .auth()
            .currentUser.getIdToken(true)
            .then(async (res) => {
              const loginData = await login(res);
              const { data, status } = loginData;
              if (status !== 200) toast.error(data?.error);
              else {
                setCurrentUser({ ...currentUser, userdata: data });
                navigate("/");
              }
            })
            .catch((err) => {
              console.log({ err });
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }

    setLoading(false);
  };

  const handleClickShowPassword = () =>
    setPasswordVisibility(!passwordVisibility);

  return (
    <div className="flex min-h-full justify-center items-center py-8 lg:py-6 md:py-5 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex items-center flex-col">
          <div className="sm:w-[12rem] md:w-[18rem] h-[8rem] sm:flex md:flex sm:mb-4 md:mb-12 lg:mb-16 hidden">
            <SVGComponent type="phone" />
          </div>
          <div className="w-[25rem] md:hidden sm:hidden">
            <SVGComponent />
          </div>
          <h2 className="my-3 text-center sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="p-4">
          <div className="rounded-md">
            <TextField
              className="my-2"
              id="email"
              label="Email"
              variant="outlined"
              required
              type="text"
              fullWidth
              placeholder="johndoe@example.com"
              margin="dense"
              name="email"
              error={errors?.email}
              helperText={
                errors?.email ? (
                  <span className="flex items-center">
                    <CloseIcon fontSize="small" />
                    Please enter a valid email
                  </span>
                ) : (
                  false
                )
              }
              value={userData?.email}
              onChange={(e) => {
                let { name, value } = e.target;
                value = value.trim();
                if (value === "") setError(name);
                if (!emailValidation(value)) setError(name);
                else removeError(name);
                setValues(name, value);
              }}
            />

            <div className="relative">
              <TextField
                id="password"
                label="Password"
                variant="outlined"
                required
                fullWidth
                type={passwordVisibility ? "text" : "password"}
                margin="dense"
                name="password"
                placeholder="********"
                error={errors?.password}
                value={userData?.password}
                helperText={
                  errors?.password ? (
                    <span className="flex items-center">
                      <CloseIcon fontSize="small" />
                      Password cannot be less than 8 characters
                    </span>
                  ) : (
                    false
                  )
                }
                onChange={(e) => {
                  // password will come here
                  let { name, value } = e.target;
                  value = value.trim();
                  if (value === "") setError(name);
                  if (value?.length < 8) setError(name);
                  else removeError(name);
                  setValues(name, value);
                }}
              />
              <div className="show_pass_btn" onClick={handleClickShowPassword}>
                {passwordVisibility ? (
                  <VisibilityIcon fontSize="medium" />
                ) : (
                  <VisibilityOffIcon fontSize="medium" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end text-logoBlue text-xl sm:text-lg font-bold">
            <div
              onClick={() => navigate("/forgot-password")}
              className="text-logoBlue cursor-pointer hover:underline "
            >
              Forgot your password?
            </div>
          </div>

          <button
            className="btn_default flex items-center mt-2"
            onClick={validateData}
            disabled={errors?.password || errors?.email || loading}
          >
            <Loading loading={loading} width={18} />
            Sign in
          </button>
        </div>
        <div>
          <Divider />
          <div className="sm:text-lg text-xl text-black text-center">
            Don’t have an account?&nbsp;
            <span
              onClick={() => navigate("/signup")}
              className="text-logoBlue cursor-pointer hover:underline font-bold"
            >
              Sign up
            </span>
            &nbsp;for free
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
