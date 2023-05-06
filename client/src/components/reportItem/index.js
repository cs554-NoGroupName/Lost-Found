import React from "react";
import { IconButton, MenuItem, Modal, TextField } from "@mui/material";
import LayoutProvider from "components/common/Layout";
import {
  nameValidation,
  validateDescription,
  validateTags,
} from "utils/helper";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PhotoCamera } from "@mui/icons-material";
import {
  categoryOptions,
  itemTypeOptions,
  locationOptions,
} from "utils/constants";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DefaultProfile from "../../utils/images/no-image-icon.png";

import "./styles.css";
import PreviewModal from "./previewModal";
import useDocumentTitle from "components/common/useDocumentTitle";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { reportItem } from "utils/apis/item";

function ReportItem() {
  const [itemData, setItemData] = React.useState({
    type: "Lost",
    category: "Electronics",
  });
  const navigate = useNavigate();

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
    if (Object.keys(errors).length !== 0) return false;
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
    if (!imageObj) errorObj.image = true;
    if (!itemData?.lastSeenLocation) errorObj.lastSeenLocation = true;
    if (!itemData?.dateTime) errorObj.dateTime = true;

    if (Object.keys(errorObj).length !== 0) return setErrors(errorObj);
    else setErrors({});
    const {
      itemName,
      type,
      description,
      category,
      tags,
      lastSeenLocation,
      dateTime,
    } = itemData;
    const apiBody = {
      itemName,
      type,
      description,
      category,
      tags,
      lastSeenLocation,
      lastSeenDate: dateTime?.$d,
      imageUrl: imageObj,
    };
    setReviewData(apiBody);

    setPreviewModal(true);
  };

  const submitItemData = async () => {
    setLoading(true);
    const formdata = new FormData();
    const {
      itemName,
      type,
      description,
      category,
      tags,
      lastSeenLocation,
      dateTime,
    } = itemData;

    formdata.append("itemName", itemName);
    formdata.append("description", description);
    formdata.append("type", type);
    formdata.append("category", category);
    formdata.append("tags", tags);
    formdata.append("lastSeenLocation", lastSeenLocation);
    formdata.append("lastSeenDate", dateTime?.$d?.toISOString());
    // formdata.append("imageUrl", dataURLtoFile(imageObj, itemName));
    formdata.append("imageUrl", imageObj);
    const reportData = await reportItem(formdata);
    const { status, data } = reportData;
    if (status !== 201) toast.error(data?.error);
    else {
      toast.success("Item posted successfully.");
      toast.success("Redirecting...");
      setTimeout(() => navigate("/items/" + data._id), 4000);
    }
    setLoading(false);
  };

  const sectionHeading = (num, title) => {
    return (
      <div
        className={`flex items-center text-[24px] text-bold text-logoBlue my-2 ${
          num === 2 &&
          "sm:my-2 md:mt-[89px] lg:mt-[89px] xl:mt-[89px] 2xl:mt-[89px]"
        }`}
      >
        <div className="section_number">{num}</div>
        &nbsp;{title}
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div>
        <div className="sm:block md:flex lg:flex xl:flex 2xl:flex">
          <div className="sm:mr-0 mr-5 w-[100%]">
            <div className="mx-1 mt-3 w-full sm:w-full md:w-full">
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
            <div className="mx-1 w-full sm:w-full md:w-full">
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
            <div className="mx-1 w-full sm:w-full md:w-full">
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
            <div className="mx-1 w-full sm:w-full md:w-full">
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
            <div className="mx-1 w-full sm:w-full md:w-full">
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

            <div className="flex items-center">
              <div>
                {imageObj ? (
                  <>
                    <img
                      src={
                        imageObj
                          ? URL.createObjectURL(imageObj)
                          : DefaultProfile
                      }
                      alt="item"
                      width={400}
                      height={200}
                    />
                    <button
                      className="btn_default__cancel mt-2"
                      onClick={() => {
                        setImageObj(null);
                        handleClose();
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <IconButton
                    sx={{
                      color: "#393e46",
                      fontSize: "22px",
                      display: "flex",
                      border: "2px solid #1c2536",
                      borderRadius: "4px",
                      marginRight: "10px",
                      padding: " 4px 10px",
                    }}
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
                        removeError("image");
                      }}
                    />
                    <PhotoCamera color="#393e46" sx={{ fontSize: "25px" }} />
                    &nbsp;Upload Image
                  </IconButton>
                )}
              </div>
              {errors?.image && (
                <div>
                  <span className="flex items-center text-[#d32f2f]">
                    <CloseIcon fontSize="small" />
                    Image required
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="sm:ml-0 ml-5 w-[100%]">
            {sectionHeading(2, "Where")}
            <div className="mx-1 w-full sm:w-full md:w-full">
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
            <div className="mx-1 mt-3 w-full sm:w-full md:w-full">
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
    <LayoutProvider title={`Report ${itemData?.type} Item`}>
      {useDocumentTitle("Report Item")}
      {renderForm()}

      <PreviewModal
        loading={loading}
        open={previewModal}
        onClose={closePreviewModal}
        data={reviewData}
        onSubmit={submitItemData}
      />
    </LayoutProvider>
  );
}

export default ReportItem;
