import React from "react";
import { Dialog, MenuItem, TextField } from "@mui/material";
import {
  capitalizeFirstLetter,
  itemNameValidation,
  nameValidation,
  validateDescription,
  validateTags,
} from "utils/helper";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  categoryOptions,
  itemTypeOptions,
  locationOptions,
} from "utils/constants";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import dayjs from "dayjs";
import { editItemById } from "utils/apis/item";
import { toast } from "react-toastify";
import Loading from "components/common/BtnLoading";

function EditItemForm({ open, onClose, data }) {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [itemData, setItemData] = React.useState(data);
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

  React.useEffect(() => {
    setItemData(data);
    return () => {
      setItemData({});
    };
  }, [data]);

  const validateData = async () => {
    setLoading(true);
    // if (Object.keys(errors).length !== 0) return;
    if (Object.keys(itemData).length === 0) {
      return setErrors({
        itemName: true,
        type: true,
        description: true,
        category: true,
        tags: true,
        image: true,
        lastSeenLocation: true,
        lastSeenDate: true,
      });
    }

    const errorObj = {};
    if (!itemData?.itemName) errorObj.itemName = true;
    if (!itemData?.type) errorObj.type = true;
    if (!itemData?.description) errorObj.description = true;
    if (!itemData?.category) errorObj.category = true;
    if (!itemData?.tags) errorObj.tags = true;
    if (!itemData?.lastSeenLocation) errorObj.lastSeenLocation = true;
    if (!itemData?.lastSeenDate) errorObj.lastSeenDate = true;

    console.log({ errorObj });
    if (Object.keys(errorObj).length !== 0) return setErrors(errorObj);
    else setErrors({});
    const {
      itemName,
      type,
      description,
      category,
      tags,
      lastSeenLocation,
      lastSeenDate,
    } = itemData;
    const apiBody = {
      itemName,
      type,
      description,
      category,
      tags,
      lastSeenLocation,
      lastSeenDate: lastSeenDate?.$d ?? lastSeenDate,
    };

    console.log({ apiBody });
    const { status, data } = await editItemById(itemData._id, apiBody);
    if (status !== 200) toast.error("Failed to update details!");
    else {
      // setItemData(data?.updatedItem);
      onClose(status, data.updatedItem);
    }
    setLoading(false);
  };

  const sectionHeading = (num, title) => {
    return (
      <div
        className={`flex items-center text-[24px] text-bold text-logoBlue my-2 ${
          num === 2 &&
          "sm:my-2 md:mt-[89px] lg:mt-[89px] xl:mt-[89px] 2xl:mt-[89px] mt-[89px]"
        }`}
      >
        <div className="section_number">{num}</div>
        &nbsp;{title}
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      //   maxWidth={false}
      sx={{
        ".MuiPaper-root": {
          width: "80%",
          maxWidth: "80%",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1.5rem",
          backgroundColor: "#1c2536",
          color: "white",
        }}
      >
        Edit item details
      </DialogTitle>
      <DialogContent>
        <div>
          <div className="sm:block md:flex lg:flex xl:flex 2xl:flex flex">
            <div className="sm:mr-0 mr-5 w-[100%]">
              <div className="mx-1 mt-3 w-full sm:w-full md:w-full">
                <TextField
                  id="type"
                  select
                  label="Type"
                  fullWidth
                  required
                  margin="dense"
                  disabled={true}
                  value={capitalizeFirstLetter(itemData?.type) ?? ""}
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
                    if (!itemNameValidation(value)) setError(name);
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
                {errors?.lastSeenLocation && (
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
                    sx={{ border: errors?.lastSeenDate ? "1px solid red" : "" }}
                    value={
                      dayjs(itemData?.lastSeenDate) ??
                      dayjs(new Date().toISOString())
                    }
                    renderInput={(params) => (
                      <TextField
                        required
                        margin="dense"
                        onKeyDown={(e) => e.preventDefault()}
                        error={errors?.lastSeenDate}
                        helperText={
                          errors?.lastSeenDate ? (
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
                      if (e === null) removeError("lastSeenDate");
                      setValues("lastSeenDate", e);
                    }}
                    onError={(e, f) => {
                      if (e === "invalidDate") setError("lastSeenDate");
                      if (e === null) removeError("lastSeenDate");
                    }}
                    maxDate={dayjs(new Date().toISOString())}
                    defaultValue={dayjs(new Date().toISOString())}
                    // minDate={dayjs(new Date(+new Date() - 3156000000000))}
                    openTo={"day"}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </DialogContent>
      <DialogActions sx={{ marginTop: "10px" }}>
        <button onClick={onClose} className="btn_default__cancel">
          Cancel
        </button>
        <button
          className="btn_default"
          onClick={validateData}
          disabled={loading}
        >
          <Loading loading={loading} />
          Save
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default EditItemForm;
