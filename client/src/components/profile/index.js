import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Modal,
  TextField,
  CardMedia,
  Tooltip,
  Grid,
  Divider,
  Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  PhotoCamera,
  Email,
  PhoneAndroid,
  Cake,
  Close,
  Wc
} from "@mui/icons-material";
import LayoutProvider from "components/common/Layout";
import Loading from "components/common/BtnLoading";
import useDocumentTitle from "components/common/useDocumentTitle";
import {
  capitalizeFirstLetter,
  fullNameFormatter,
  nameValidation,
  phoneNumberFormatter,
} from "utils/helper";
import DefaultProfile from "../../utils/images/default_profile_pic.png";
import { genderOptions } from "utils/constants";
import {
  getUserDetails,
  updateUserProfileData,
  uploadUserProfilePhoto,
} from "utils/apis/user";
import { setUserData } from "redux/reducer";
import "./styles.css";

function Profile() {
  const editorRef = React.useRef(null);
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.userData?.userData);
  const [modalView, setModalView] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [updateUserData, setUpdateUserData] = React.useState(state);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [imageUplaodLoading, setImageUplaodLoading] = React.useState(false);
  const [imageObj, setImageObj] = React.useState(null);
  const [profileData, setProfileData] = React.useState(state);

  const handlemodalView = () => setModalView(true);
  const handleClose = () => setModalView(false);

  React.useEffect(() => {
    setUpdateUserData(state);
    setProfileData(state);
  }, [state]);

  React.useEffect(() => {
    getUserDetails()
      .then((res) => {
        const { status, data } = res;
        if (status !== 200) toast.error("Something went wrong");
        else dispatch(setUserData({ data }));
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [dispatch]);

  const uploadImage = async () => {
    setImageUplaodLoading(true);
    let formData = new FormData();
    formData.append("imageUrl", imageObj);
    const { data } = await uploadUserProfilePhoto(formData);
    dispatch(setUserData({ data }));
    setImageObj(null);
    setImageUplaodLoading(false);
    handleClose();
  };

  const setValues = (name, value) => {
    setUpdateUserData({ ...updateUserData, [name]: value });
  };

  const setError = (name) => {
    setErrors({ ...errors, [name]: true });
  };

  const removeError = (name) => {
    const errorObj = errors;
    delete errorObj[name];
    setErrors(errorObj);
  };

  const validateData = async () => {
    if (Object.keys(errors).length !== 0) return false;
    setUpdateLoading(true);
    if (Object.keys(updateUserData).length === 0) {
      return setErrors({
        firstName: true,
        lastName: true,
        phone: true,
        dob: true,
        gender: true,
      });
    }

    const errorObj = {};
    if (!updateUserData?.firstName) errorObj.firstName = true;
    if (!updateUserData?.lastName) errorObj.lastName = true;
    if (!updateUserData?.phone) errorObj.phone = true;
    if (!updateUserData?.dob) errorObj.dob = true;
    if (!updateUserData?.gender) errorObj.gender = true;

    if (Object.keys(errorObj).length !== 0) return setErrors(errorObj);
    else setErrors({});

    const { firstName, lastName, phone, dob, gender } = updateUserData;

    const today = new Date(dob);

    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = mm + "/" + dd + "/" + yyyy;
    const apiBody = {
      firstName,
      lastName,
      phone,
      dob: formattedToday,
      gender,
    };

    const editInfo = await updateUserProfileData(apiBody);
    const { data, status } = editInfo;
    if (status !== 200) toast.error(data?.error);
    else {
      dispatch(setUserData({ data }));
      setUpdateUserData(data);
      toast.success("Profile updated.");
    }
    setUpdateLoading(false);
  };

  const ProfileView = () => {
    const { firstName, lastName, email, phone, dob, gender, image_url } =
      profileData ?? {};
    return (
      <Card
        sx={{
          minWidth: { xs: "fit-content", sm: "fit-content", md: "48%", lg: "49%" },
          padding: "20px",
        }}
      >
        <div style={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="280"
            image={image_url ?? DefaultProfile}
            alt="profile picture"
            sx={{
              height: "300px",
              width: '300px',
              borderRadius: "50%",
              objectFit: "cover",
              maxHeight: "300px",
              maxWidth: "300px",
              position: "relative",
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow: "0px 0px 20px 5px #ff9717",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 20
            }}
          >
            <Tooltip
              title="Upload new profile picture"
              placement="top"
              arrow={true}
            >
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                onClick={handlemodalView}
                sx={{
                  backgroundColor: "rgba(0,0,0,0.7)",
                  boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.9)",
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.9)"
                  }
                }}
              >
                <PhotoCamera sx={{ color: "#fff", fontSize: "2.5rem" }} />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <CardHeader
          title={fullNameFormatter(firstName, lastName)}
          sx={{
            padding: "16px 10px 10px 10px",
            display: { sx: "flex", sm: "flex", md: "block" },
            flexDirection: "column",
            flexWrap: "wrap",
            alignContent: "stretch",
            alignItems: "center"
          }}
        />

        <Divider />

        <CardContent
          sx={{
            padding: "16px 10px 10px 10px",
            display: { sx: "flex", sm: "flex", md: "block" },
            flexDirection: "column",
            flexWrap: "wrap",
            alignContent: "stretch",
            alignItems: "center",
          }}
        >
          <Grid container
            direction="column"
            spacing={1}>
            <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
              <Email
                sx={{
                  height: "50px",
                  width: "50px",
                  padding: "5px",
                  fontSize: "2rem",
                  backgroundColor: "#ff9717",
                  borderRadius: "50%"
                }}
              />
              <Typography variant="body2" color="text.secondary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  backgroundColor: "rgba(0,0,0,0.1)",
                  marginLeft: "10px",
                  paddingLeft: "10px",
                  borderRadius: "20px",
                  height: "50px",
                  width: "100%"
                }}
              >
                {email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
              <PhoneAndroid
                sx={{
                  height: "50px",
                  width: "50px",
                  padding: "5px",
                  fontSize: "2rem",
                  backgroundColor: "#ff9717",
                  borderRadius: "50%"
                }}
              />
              <Typography variant="body2" color="text.secondary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  backgroundColor: "rgba(0,0,0,0.1)",
                  marginLeft: "10px",
                  paddingLeft: "10px",
                  borderRadius: "20px",
                  height: "50px",
                  width: "100%"
                }}
              >
                {phoneNumberFormatter(phone)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
              <Cake
                sx={{
                  height: "50px",
                  width: "50px",
                  padding: "5px",
                  fontSize: "2rem",
                  backgroundColor: "#ff9717",
                  borderRadius: "50%"
                }}
              />
              <Typography variant="body2" color="text.secondary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  backgroundColor: "rgba(0,0,0,0.1)",
                  marginLeft: "10px",
                  paddingLeft: "10px",
                  borderRadius: "20px",
                  height: "50px",
                  width: "100%"
                }}
              >
                {dayjs(dob).format("DD MMM YYYY")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
              <Wc
                sx={{
                  height: "50px",
                  width: "50px",
                  padding: "5px",
                  fontSize: "2rem",
                  backgroundColor: "#ff9717",
                  borderRadius: "50%"
                }}
              />
              <Typography variant="body2" color="text.secondary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  backgroundColor: "rgba(0,0,0,0.1)",
                  marginLeft: "10px",
                  paddingLeft: "10px",
                  borderRadius: "20px",
                  height: "50px",
                  width: "100%"
                }}
              >
                {capitalizeFirstLetter(gender)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const UploadPictureModal = () => {
    return (
      <Modal
        open={modalView}
        onClose={() => {
          setImageObj(null);
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="profile_upload_modal">
          <img
            className="user_profile_picture"
            src={imageObj ? URL.createObjectURL(imageObj) : DefaultProfile}
            ref={editorRef}
            width={"250px"}
            height={"280px"}
            alt="preview"
          />
          <div>
            {imageObj ? (
              <div className="flex mt-4">
                <button className="btn_default mr-2" onClick={uploadImage}>
                  <Loading loading={imageUplaodLoading} width={18} />
                  Upload
                </button>
                <button
                  className="btn_default__cancel"
                  onClick={() => {
                    setImageObj(null);
                    handleClose();
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                disableRipple={true}
              >
                <input
                  hidden
                  accept=".png, .jpg, .jpeg"
                  type="file"
                  onChange={(e) => {
                    e.preventDefault();
                    if (e.target.files[0]?.size / (1024 * 1024) > 5)
                      return toast.error("File size more than 5MB");
                    setImageObj(e.target.files[0]);
                  }}
                />
                <PhotoCamera />
                upload image
              </IconButton>
            )}
          </div>
        </div>
      </Modal>
    );
  };

  const { firstName, lastName, phone, dob, gender } = updateUserData ?? {};

  return (
    <>
      {useDocumentTitle("Profile")}
      <LayoutProvider>

        <Typography variant="h5" component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            backgroundColor: "#fff",
            borderRadius: "5px",
            width: "100%",
            padding: "10px",
            margin: { xs: "0px 0px 10px 0px", sm: "0px 0px 10px 0px", md: "0px 0px 10px 0px", lg: "0px 0px 10px 0px" },
            boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.3)",
          }}
        >
          Profile Page
        </Typography>

        <div className="sm:block flex justify-around sm:mx-0 md:mx-[40px] mx-0">

          <ProfileView />

          <Card
            sx={{
              minWidth: { xs: "fit-content", sm: "fit-content", md: "50%" },
              maxWidth: "100%",
              padding: "20px",
              marginLeft: { xs: "0px", sm: "0px", md: "20px" },
              marginTop: { xs: "20px", sm: "20px", md: "0px" },
              // display: loading ? "flex" : "block",
              display: "block",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* {loading ? (
          <Loading loading={loading} width={50} color="#1c2536" />
        ) : ( */}
            <CardContent sx={{ padding: "0" }}>
              <div className="mr-3 w-full ">
                <TextField
                  id="firstName"
                  label="First Name"
                  variant="outlined"
                  error={errors?.firstName}
                  required
                  fullWidth
                  type="text"
                  value={firstName}
                  name="firstName"
                  margin="dense"
                  placeholder="John"
                  helperText={
                    errors?.firstName ? (
                      <span className="text-base flex items-center">
                        <Close fontSize="small" />
                        Enter a valid First Name
                      </span>
                    ) : (
                      false
                    )
                  }
                  onChange={(e) => {
                    let { name, value } = e.target;
                    if (value === "") setError(name);
                    if (!nameValidation(value)) setError(name);
                    else removeError(name);
                    setValues(name, value);
                  }}
                />
              </div>
              <div className="mr-3 w-full ">
                <TextField
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  error={errors?.lastName}
                  variant="outlined"
                  required
                  fullWidth
                  type="text"
                  margin="dense"
                  value={lastName}
                  placeholder="Doe"
                  helperText={
                    errors?.lastName ? (
                      <span className="text-base flex items-center">
                        <Close fontSize="small" />
                        Enter a valid Last Name
                      </span>
                    ) : (
                      false
                    )
                  }
                  onChange={(e) => {
                    let { name, value } = e.target;
                    if (value === "") setError(name);
                    if (!nameValidation(value)) setError(name);
                    else removeError(name);
                    setValues(name, value);
                  }}
                />
              </div>

              {/* <div className="mr-3 w-full ">
                <TextField

                  id="email"
                  label="Email"
                  variant="outlined"
                  required
                  type="email"
                  fullWidth
                  margin="dense"
                  value={email ?? ""}
                  name="email"
                  placeholder="johndoe@example.com"
                  helperText={
                    errors?.email ? (
                      <span className="text-base flex items-center">
                        <CloseIcon fontSize="small" />
                        Enter a valid email
                      </span>
                    ) : (
                      false
                    )
                  }
                  error={errors?.email}
                  onChange={(e) => {
                    let { name, value } = e.target;
                    if (value === "") setError(name);
                    if (!emailValidation(value)) setError(name);
                    else removeError(name);
                    setValues(name, value);
                  }}
                />
              </div> */}
              <div className="mr-3 w-full ">
                <TextField
                  id="gender"
                  select
                  label="Select gender"
                  fullWidth
                  required
                  margin="dense"
                  value={gender ?? ""}
                  name="gender"
                  placeholder="select a gender"
                  error={errors?.gender}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    if (value !== "") {
                      setValues(name, value);
                      removeError(name);
                    } else setError(name);
                  }}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                {errors?.gender && (
                  <span className="helperText__gender text-base flex items-center ">
                    <Close fontSize="small" />
                    Choose a gender
                  </span>
                )}
              </div>

              <div className="mr-3 w-full ">
                <TextField
                  id="phone"
                  label="Phone"
                  variant="outlined"
                  required
                  fullWidth
                  type="phone"
                  margin="dense"
                  name="phone"
                  error={errors?.phone}
                  placeholder="1234567899"
                  value={phone ?? ""}
                  helperText={
                    errors?.phone ? (
                      <span className="text-base flex items-center">
                        <Close fontSize="small" />
                        Enter a valid phone number
                      </span>
                    ) : (
                      false
                    )
                  }
                  onChange={(e) => {
                    let { name, value } = e.target;
                    if (value === "") setError(name);
                    if (value.length < 10 || value.length > 10) setError(name);
                    else removeError(name);
                    setValues(name, value);
                  }}
                />
              </div>
              <div className="mr-3 w-full ">
                <div className="mt-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of birth"
                      disableFuture
                      inputFormat="MM/DD/YYYY"
                      value={dayjs(dob) ?? null}
                      renderInput={(params) => (
                        <TextField
                          required
                          onKeyDown={(e) => e.preventDefault()}
                          error={errors?.dob}
                          helperText={
                            errors?.dob ? (
                              <span className="helperText__dob text-base flex items-center">
                                <Close fontSize="small" />
                                Enter a valid date
                              </span>
                            ) : (
                              false
                            )
                          }
                          {...params}
                        />
                      )}
                      onChange={(e) => {
                        if (e === null) removeError("dob");
                        setValues("dob", e);
                      }}
                      onError={(e, f) => {
                        if (e === "invalidDate") setError("dob");
                        if (e === null) removeError("dob");
                      }}
                      maxDate={dayjs(
                        new Date(+new Date() - 410200000000 - 86400000)
                      )}
                      minDate={dayjs(new Date(+new Date() - 3156000000000))}
                      modalViewTo={"day"}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </CardContent>
            <CardActions>
              <button className="btn_default mr-2" onClick={validateData}>
                <Loading loading={updateLoading} width={18} /> Update
              </button>{" "}
            </CardActions>
            {/* </> */}
            {/* )} */}
          </Card>
          {UploadPictureModal()}
        </div>
      </LayoutProvider>
    </>
  );
}

export default Profile;
