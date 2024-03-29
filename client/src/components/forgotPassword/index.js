import React from "react";
import { Divider, TextField } from "@mui/material";
import { emailValidation } from "../../utils/helper";
import CloseIcon from "@mui/icons-material/Close";
import "./styles.css";
import SVGComponent from "../common/Logo";
import { forgotPassword } from "../../utils/apis/auth";
import { toast } from "react-toastify";
import Loading from "../common/BtnLoading";
import { useNavigate } from "react-router";
import useDocumentTitle from "components/common/useDocumentTitle";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [resetSuccess, setResetSuccess] = React.useState(false);

  const validateData = async (e) => {
    e.preventDefault();
    if (!emailValidation(email)) return setError(true);

    if (!error) {
      setLoading(true);
      setResetSuccess(false);
      const response = await forgotPassword({ email: email });
      const { status, data } = response;
      if (status !== 200) {
        const { message } = data;
        if (typeof message === "string") toast.error(data?.message);
        else if (message?.code === "auth/user-not-found")
          toast.error("User not found!");
      } else setResetSuccess(true);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-full justify-center items-center py-8 lg:py-6 md:py-5 px-4 sm:px-6 lg:px-8">
      {useDocumentTitle("Forgot Password")}
      <div className="w-full max-w-lg space-y-4">
        <div className="flex items-center flex-col">
          <div className="sm:w-[12rem] md:w-[18rem] h-[8rem] sm:flex md:flex sm:mb-4 md:mb-12 lg:mb-16 hidden">
            <SVGComponent type="phone" />
          </div>
          <div className="w-[25rem] md:hidden sm:hidden">
            <SVGComponent />
          </div>
          <div className="my-3 text-center sm:text-xl md:text-2xl lg:text-2xl text-3xl font-bold tracking-tight text-gray-900">
            Forgot password
          </div>
        </div>

        <div className="space-y-4">
          {resetSuccess ? (
            <div className="text-2xl">
              We have sent you an email with a password reset link to reset the
              password.
            </div>
          ) : (
            <div className="-space-y-px rounded-md px-4">
              <div className="text-lg mb-4">
                Enter the email address associated with your account and we'll
                send you a link to reset your password.
              </div>
              <TextField
                className="my-2"
                id="forgotPassword-email"
                label="Email"
                variant="outlined"
                required
                type="text"
                fullWidth
                margin="dense"
                placeholder="johndoe@example.com"
                name="email"
                error={error}
                value={email}
                helperText={
                  error ? (
                    <span className="text-base flex items-center">
                      <CloseIcon fontSize="small" />
                      Please enter a valid email
                    </span>
                  ) : (
                    false
                  )
                }
                onChange={(e) => {
                  let { value } = e.target;
                  value = value.trim();
                  if (value === "") setError(true);
                  if (!emailValidation(value)) setError(true);
                  else setError(false);
                  setEmail(value);
                }}
              />
              <div className="flex items-center pt-4">
                <button
                  className="btn_default flex items-center"
                  onClick={validateData}
                  disabled={error || loading}
                >
                  <Loading loading={loading} width={18} color="#1c2536" />
                  Send me an email
                </button>
              </div>
            </div>
          )}
          <div className="pt-4">
            <Divider />
            <span className="text-xl">
              <div
                onClick={() => navigate("/login")}
                className="text-logoBlue cursor-pointer hover:underline font-bold"
              >
                back to login
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
