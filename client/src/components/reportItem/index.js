import React from "react";
import { IconButton, MenuItem, Modal, TextField } from "@mui/material";

import LayoutProvider from "components/common/Layout";
// import { AuthContext } from "../../firebase/auth";
import {
  nameValidation,
  validateDescription,
  validateTags,
} from "utils/helper";
import FlagIcon from "@mui/icons-material/Flag";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PhotoCamera } from "@mui/icons-material";
// import dayjs from "dayjs";
import {
  categoryOptions,
  itemTypeOptions,
  locationOptions,
} from "utils/constants";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import Loading from "components/common/Loading";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DefaultProfile from "../../utils/images/no-image-icon.png";

import "./styles.css";
import PreviewModal from "./previewModal";
// import { AuthContext } from "../../FirebaseUtils/authenticate";

function ReportItem() {
  // const [currentUser] = React.useContext(AuthContext);
  const [itemData, setItemData] = React.useState({
    type: "Lost",
    category: "Electronics",
  });

  const [reviewData, setReviewData] = React.useState({});

  const [previewModal, setPreviewModal] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const [modalView, setModalView] = React.useState(false);
  const [imageObj, setImageObj] = React.useState(null);

  const setValues = (name, value) => {
    setItemData({ ...itemData, [name]: value });
  };

  const setError = (name) => {
    setErrors({ ...errors, [name]: true });
  };

  const removeError = (name) => {
    const errorObj = errors;
    delete errorObj[name];
    setErrors(errorObj);
  };

  const closePreviewModal = () => {
    setPreviewModal(false);
  };

  const handlemodalView = () => setModalView(true);
  const handleClose = () => setModalView(false);

  const validateData = () => {
    if (Object.keys(itemData).length === 0) {
      return setErrors({
        itemName: true,
        type: true,
        description: true,
        category: true,
        tags: true,
        image: true,
        lastSeenLocation: true,
        dateTime: true,
      });
    }

    const errorObj = {};
    if (!itemData?.itemName) errorObj.itemName = true;
    if (!itemData?.type) errorObj.type = true;
    if (!itemData?.description) errorObj.description = true;
    if (!itemData?.category) errorObj.category = true;
    if (!itemData?.tags) errorObj.tags = true;
    // if (!itemData?.image) errorObj.image = true;
    if (!itemData?.lastSeenLocation) errorObj.lastSeenLocation = true;
    if (!itemData?.dateTime) errorObj.dateTime = true;

    if (Object.keys(errorObj).length !== 0) return setErrors(errorObj);
    else setErrors({});
    setPreviewModal(true);
    setLoading(true);
    const {
      itemName,
      type,
      description,
      category,
      tags,
      image,
      lastSeenLocation,
      dateTime,
    } = itemData;
    // const today = new Date(dateTime);
    // console.log({ today });
    // const yyyy = today.getFullYear();
    // let mm = today.getMonth() + 1; // Months start at 0!
    // let dd = today.getDate();

    // if (dd < 10) dd = "0" + dd;
    // if (mm < 10) mm = "0" + mm;

    // const formattedToday = mm + "/" + dd + "/" + yyyy;
    const apiBody = {
      itemName,
      type,
      description,
      category,
      tags,
      image,
      lastSeenLocation,
      dateTime: dateTime.$d.toString(),
    };
    setReviewData(apiBody);

    console.log({ apiBody });

    // const singupInfo = await signup(apiBody);

    // const { data, status } = singupInfo;
    // if (status !== 201) toast.error(data?.error);
    // else {
    //   toast.success(
    //     "User registered successfully. Please check your inbox to verify your account."
    //   );
    //   setTimeout(() => navigate("/"), 4000);
    // }
    setLoading(false);
  };

  const sectionHeading = (num, title) => {
    return (
      <div className="flex items-center text-[24px] text-bold text-logoBlue my-2">
        <div className="section_number">{num}</div>
        &nbsp;{title}
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div>
        <div>
          <div className="mx-1 mt-3 w-6/12 sm:w-full md:w-full">
            <TextField
              id="type"
              select
              label="Type"
              fullWidth
              required
              margin="dense"
              value={itemData?.type ?? ""}
              name="type"
              placeholder="Lost/Found"
              error={errors?.type}
              onChange={(e) => {
                const { name, value } = e.target;
                if (value !== "") {
                  setValues(name, value);
                  removeError(name);
                } else setError(name);
              }}
            >
              {itemTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            {errors?.type && (
              <span className="helperText__gender text-base flex items-center ">
                <CloseIcon fontSize="small" />
                Choose type
              </span>
            )}
          </div>
          {sectionHeading(1, "What")}
          <div className="mr-2 w-6/12 sm:w-full md:w-full">
            <TextField
              id="itemName"
              label="Item Name"
              variant="outlined"
              required
              type="name"
              fullWidth
              margin="dense"
              value={itemData?.itemName ?? ""}
              name="itemName"
              placeholder="Apple Airpods pro"
              helperText={
                errors?.itemName ? (
                  <span className=" flex items-center">
                    <CloseIcon fontSize="small" />
                    Only Aphabets and numbers allowed
                  </span>
                ) : (
                  false
                )
              }
              error={errors?.itemName}
              onChange={(e) => {
                let { name, value } = e.target;
                if (value === "") setError(name);
                if (!nameValidation(value)) setError(name);
                else removeError(name);
                setValues(name, value);
              }}
            />
          </div>
          <div className="mr-2 w-8/12 sm:w-full md:w-full">
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              required
              type="text"
              fullWidth
              margin="dense"
              minRows={2}
              multiline
              value={itemData?.description ?? ""}
              name="description"
              placeholder="White color engraved name on it as `Joey`"
              helperText={
                //NOTE is this field required and also what about the validation
                errors?.description ? (
                  <span className=" flex items-center">
                    <CloseIcon fontSize="small" />
                    Enter some description
                  </span>
                ) : (
                  false
                )
              }
              error={errors?.description}
              onChange={(e) => {
                let { name, value } = e.target;
                if (value === "") setError(name);
                if (!validateDescription(value)) setError(name);
                else removeError(name);
                setValues(name, value);
              }}
            />
          </div>
          <div className="mr-2 w-6/12 sm:w-full md:w-full">
            <TextField
              id="category"
              label="Category"
              required
              select
              fullWidth
              placeholder="eg. electronics"
              margin="dense"
              name="category"
              error={errors?.category}
              helperText={
                errors?.category ? (
                  <span className="text-base flex items-center">
                    <CloseIcon fontSize="small" />
                    Select one category
                  </span>
                ) : (
                  false
                )
              }
              value={itemData?.category}
              onChange={(e) => {
                const { name, value } = e.target;
                if (value !== "") {
                  setValues(name, value);
                  removeError(name);
                } else setError(name);
              }}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="mr-2 w-6/12 sm:w-full md:w-full">
            <TextField
              id="tags"
              label="Tags"
              variant="outlined"
              required
              type="text"
              fullWidth
              placeholder="eg. earphones"
              margin="dense"
              name="tags"
              error={errors?.tags}
              helperText={
                errors?.tags ? (
                  <span className="text-base flex items-center">
                    <CloseIcon fontSize="small" />
                    Enter atleast one tag
                  </span>
                ) : (
                  <span className="text-base flex items-center">
                    <InfoOutlinedIcon fontSize="small" />
                    &nbsp;Enter tags(comma seperated)
                  </span>
                )
              }
              value={itemData?.tags}
              onChange={(e) => {
                let { name, value } = e.target;
                if (!validateTags(value)) setError(name);
                else removeError(name);
                setValues(name, value);
              }}
            />
          </div>

          <div>
            <div className="btn_default__light w-fit" onClick={handlemodalView}>
              {" "}
              Upload Image:
              <IconButton aria-label="upload picture" component="label">
                <PhotoCamera color="#393e46" />
              </IconButton>
            </div>
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
                  src={
                    imageObj ? URL.createObjectURL(imageObj) : DefaultProfile
                  }
                  alt="item"
                  width={400}
                  height={200}
                />
                <div>
                  {imageObj ? (
                    <div className="flex mt-4">
                      {/* <button className="btn_default mr-2" onClick={uploadImage}>
                      <Loading loading={updateLoading} width={18} /> Upload
                    </button> */}
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
                          setImageObj(e.target.files[0]);
                        }}
                      />
                      Browse
                    </IconButton>
                  )}
                </div>
              </div>
            </Modal>
          </div>
        </div>

        <div>
          {sectionHeading(2, "Where")}
          <div className="mr-2 w-6/12 sm:w-full md:w-full">
            <TextField
              id="lastSeenLocation"
              select
              label="Last Seen Location"
              fullWidth
              required
              margin="dense"
              value={itemData?.lastSeenLocation ?? ""}
              name="lastSeenLocation"
              placeholder="select a location"
              error={errors?.lastSeenLocation}
              onChange={(e) => {
                const { name, value } = e.target;
                if (value !== "") {
                  setValues(name, value);
                  removeError(name);
                } else setError(name);
              }}
            >
              {locationOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            {errors?.gender && (
              <span className="helperText__gender flex items-center ">
                <CloseIcon fontSize="small" />
                Choose a location
              </span>
            )}
          </div>
          <div className="mr-2 mt-3 w-6/12 sm:w-full md:w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Lost Date and Time"
                disableFuture
                inputFormat="MM/DD/YYYY hh:mm aa"
                format="LLL"
                value={itemData?.dateTime ?? null}
                renderInput={(params) => (
                  <TextField
                    required
                    margin="dense"
                    onKeyDown={(e) => e.preventDefault()}
                    error={errors?.dateTime}
                    helperText={
                      errors?.dateTime ? (
                        <span className="helperText__dob  flex items-center">
                          <CloseIcon fontSize="small" />
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
                  if (e === null) removeError("dateTime");
                  setValues("dateTime", e);
                }}
                onError={(e, f) => {
                  if (e === "invalidDate") setError("dateTime");
                  if (e === null) removeError("dateTime");
                }}
                // maxDate={dayjs(new Date(+new Date() - 410200000000 - 86400000))}
                // minDate={dayjs(new Date(+new Date() - 3156000000000))}
                openTo={"day"}
              />
            </LocalizationProvider>
          </div>
        </div>

        <div>
          <button
            className="btn_default mt-4"
            onClick={validateData}
            disabled={loading}
          >
            Proceed
          </button>
        </div>
      </div>
    );
  };

  return (
    <LayoutProvider>
      <div className="page_title flex items-center sm:text-sm md:text-lg text-2xl">
        <div className="mr-1">
          <FlagIcon sx={{ fontSize: 28 }} />
        </div>
        Report {itemData?.type} Item
      </div>

      {renderForm()}

      <PreviewModal
        open={previewModal}
        onClose={closePreviewModal}
        data={reviewData}
      />
    </LayoutProvider>
  );
}

export default ReportItem;
