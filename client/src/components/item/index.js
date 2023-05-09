import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  Grid,
  Box,
  Divider,
  Input,
  Typography,
  CardMedia,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  IconButton,
  Modal,
  Avatar,
  Tooltip,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";

import {
  getItemDetailsById,
  editItemById,
  editItemImage,
  sendClaimRequest,
  deleteItemById,
  confirmClaimRequest,
  declineClaimRequest,
} from "utils/apis/item";

import {
  Cancel,
  Check,
  Delete,
  Edit,
  ErrorOutline,
  PhotoCamera,
  SaveAlt,
  ThumbDownOffAlt,
  ThumbUpOffAlt,
} from "@mui/icons-material";

import LayoutProvider from "components/common/Layout";
import LoadingText from "components/common/loadingText";
import Comments from "./Comments";
import ErrorPage from "./ErrorPage";
import Header from "./HeaderComponent";
import TimelineTracker from "./TimelineTracker";
import ClaimsAndDisputes from "./ClaimsAndDisputes";
import Loading from "components/common/BtnLoading";
import CloseIcon from "@mui/icons-material/Close";

import { categoryOptions } from "utils/constants";
import moment from "moment";

const titleStyle = {
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#324b4b",
  marginBottom: "10px",
};

const titleStyleLight = {
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#e6e6e6",
  marginBottom: "10px",
};


const avatarStyle = {
  height: "55px",
  width: "55px",
  backgroundColor: "#1c2536",
  color: "#ff9717",
  fontWeight: "bold",
  fontSize: "2.5rem",
  marginRight: "10px",
};

const buttonStyle2 = {
  height: "40px",
  // width: "90px",
  borderRadius: "15px",
  backgroundColor: "#1c2536",
  fontSize: "15px",
  padding: "4px 12px",
  marginRight: "10px",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#ff9717",
    color:"#1c2536"
  },
};

const dialogButtonStyle = {
  color: "#fff",
  border: "2px solid #ff9717",
  width: "150px",
  "&:hover": {
    backgroundColor: "#ff9717",
  },
};

function ItemDetails() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state?.userData?.userData);
  const params = useParams();
  const [itemData, setItemData] = useState({});
  const [updatedItemData, setUpdatedItemData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editable, setEditable] = useState(false);
  const [statusCode, setStatusCode] = useState(200);
  const [claimRequestModalData, setClaimRequestModalData] = useState({});
  const [respondClaimRequestModal, setRespondClaimRequestModal] =
    useState(false);

  // Image Vars
  const handleModalView = () => setModalView(true);
  const editorRef = useRef(null);
  const [imageObj, setImageObj] = useState(null);
  const [modalView, setModalView] = useState(false);
  const handleClose = () => setModalView(false);
  const [imageUploadLoading, setImageUploadLoading] = React.useState(false);
  const [openClaim, setOpenClaim] = useState(false);
  const [openDispute, setOpenDispute] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleEdit = () => {
    setEditable(!editable);
  };

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleClaimOpen = () => {
    if (itemData?.type === "found" && itemData?.itemStatus === "reported") {
      setOpenClaim(true);
    } else {
      toast.info("Action not available");
    }
  };

  const handleClaimClose = () => {
    setOpenClaim(false);
  };

  const handleDisputeOpen = () => {
    if (itemData?.type === "found" && itemData?.itemStatus === "claimed") {
      setOpenDispute(true);
    } else {
      toast.info("Action not available");
    }
  };

  const handleDisputeClose = () => {
    setOpenDispute(false);
  };

  const handleDeleteAction = async () => {
    const { status, data } = await deleteItemById(itemData?._id);
    console.log(status, data);
    if (status === 200) {
      toast.success("Post deleted!");
      navigate("/profile");
    } else {
      toast.error("Failed to delete item!");
      setOpenDelete(false);
    }
  };

  const handleClaimAction = async () => {
    const { status, data } = await sendClaimRequest(itemData?._id);
    setOpenClaim(false);
    if (status === 200) {
      // setItemData(data?.updatedItem);
      toast.success("Claim request sent.");
    } else toast.info(data.error);
  };

  const handleDisputeAction = () => {
    setOpenDispute(false);
  };

  useEffect(() => {
    setLoading(true);
    getItemDetailsById(params.id).then((res) => {
      const { status, data } = res;
      if (status !== 200) {
        if (status === 404) {
          setError("Item not found!");
        } else if (status === 401) {
          setError("You are not authorized to view this item!");
        } else if (status === 400) {
          setError("Item id is invalid! Please check the url.");
        } else {
          setError(
            "Something went wrong! Please try again later or contact support."
          );
        }
        setStatusCode(status);
      } else setItemData(data?.data);
      setLoading(false);
    });
  }, [params.id]);

  const handleCategoryChange = (e) => {
    setItemData((prev) => ({
      ...prev,
      category: e.target.value,
    }));

    setUpdatedItemData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const handleDataEdit = async () => {
    if (editable) {
      const { status, data } = await editItemById(
        itemData._id,
        updatedItemData
      );
      if (status === 200) {
        setItemData(data?.updatedItem);
        setEditable(false);
      }
    } else {
      setEditable(true);
    }
  };

  const uploadImage = async () => {
    setImageUploadLoading(true);
    let formData = new FormData();
    formData.append("imageUrl", imageObj);
    const { data } = await editItemImage(itemData._id, formData);
    setItemData(data?.updatedItem);
    setImageUploadLoading(false);
    setImageObj(null);
    handleClose();
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
            src={imageObj ? URL.createObjectURL(imageObj) : itemData?.imageUrl}
            ref={editorRef}
            width={"250px"}
            height={"280px"}
            alt="preview"
          />
          <div>
            {imageObj ? (
              <div className="flex mt-4">
                <button className="btn_default mr-2" onClick={uploadImage}>
                  <Loading loading={imageUploadLoading} width={18} />
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

  const CustomSelect = ({ label, value, disabled }) => {
    return (
      <>
        <FormControl
          sx={{
            display: "flex",
            width: "100%",
            marginBottom: "20px",
          }}
        >
          <InputLabel
            id={`${params.id}-label`}
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: "1.3rem",
            }}
          >
            {label}
          </InputLabel>
          <Select
            labelId={`${params.id}-label`}
            value={value?.toLowerCase()}
            label={label}
            disabled={disabled}
            onChange={handleCategoryChange}
            sx={{
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            {categoryOptions.map((item) => (
              <MenuItem key={item} value={item.toLowerCase()}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  };

  const handleRequestModal = (type, item) => {
    if (type === "claim") {
      setClaimRequestModalData(item);
      setRespondClaimRequestModal(true);
    }
  };

  const DialogComponent = ({
    open,
    handleClose,
    handleAction,
    title,
    actionText,
    buttonCount,
  }) => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#4A5569",
            color: "#fff",
            borderRadius: "10px",
            padding: "5px",
            maxWidth: "600px",
          },
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <Divider
          sx={{
            backgroundColor: "#ff9717",
            marginBottom: "10px",
          }}
        />
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "1.2rem",
              color: "#e6e6e6",
            }}
          >
            {actionText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {buttonCount === 3 ? (
            <>
              <Button
                onClick={() => handleAction("accept")}
                startIcon={<ThumbUpOffAlt />}
                sx={dialogButtonStyle}
              >
                Accept
              </Button>
              <Button
                onClick={() => handleAction("decline")}
                startIcon={<ThumbDownOffAlt />}
                sx={dialogButtonStyle}
              >
                Decline
              </Button>
              <Button
                onClick={handleClose}
                startIcon={<Cancel />}
                sx={dialogButtonStyle}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleAction}
                startIcon={<ThumbUpOffAlt />}
                sx={dialogButtonStyle}
              >
                Confirm
              </Button>
              <Button
                onClick={handleClose}
                startIcon={<Cancel />}
                sx={dialogButtonStyle}
              >
                Cancel
              </Button>{" "}
            </>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <LayoutProvider>
        <LoadingText />
      </LayoutProvider>
    );
  } else if (error) {
    return <ErrorPage code={statusCode} message={error} />;
  } else {
    return (
      <LayoutProvider>
        {/* <Header
					itemData={itemData}
					editable={editable}
					setEditable={setEditable}
					respondClaimRequestModal={respondClaimRequestModal}
					setRespondClaimRequestModal={setRespondClaimRequestModal}
					claimRequestModalData={claimRequestModalData}
          setItemData={setItemData}
          user_firebase_id={userData?.user_firebase_id}
				/> */}

        <Box
          sx={{
            display: { sm: "block", md: "flex" },
            alignItems: " center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div className="flex items-center w-[100%]">
            <div>
              <Avatar sx={avatarStyle} src={itemData?.reportedBy?.image_url} />
            </div>
            <div>
              <div className="text-xl font-bold">
                {itemData?.reportedBy?.firstName}{" "}
                {itemData?.reportedBy?.lastName}
              </div>
              <div className="text-lg font-[600]">
                Reported on{" "}
                {moment(itemData?.reportedDate).format("MMMM Do YYYY, h:mm a")}
              </div>
            </div>
          </div>

          <div>
            <div className="xs:hidden sm:hidden flex sm:mt-[14px] justify-end w-full">
              {itemData?.uid === userData?.user_firebase_id && (
                <>
                  <Tooltip title="Edit this item" placement="bottom" arrow>
                    <Button
                      aria-label="edit"
                      onClick={handleEdit}
                      sx={buttonStyle2}
                    >
                      {editable ? (
                        <>
                          <CloseIcon sx={{ fontSize: "1.2rem" }} />
                          &nbsp;Cancel
                        </>
                      ) : (
                        <>
                          <Edit sx={{ fontSize: "1.2rem" }} />
                          &nbsp;Edit
                        </>
                      )}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete this item" placement="bottom" arrow>
                    <Button
                      aria-label="delete"
                      onClick={handleDeleteOpen}
                      sx={buttonStyle2}
                    >
                      <Delete sx={{ fontSize: "1.2rem" }} />
                      &nbsp;Delete
                    </Button>
                  </Tooltip>
                </>
              )}
              {itemData?.uid !== userData?.user_firebase_id && (
                <>
                  {itemData?.type === "found" && (
                    <>
                      {itemData?.itemStatus === "reported" && (
                        <Tooltip
                          title={
                            itemData?.type === "found"
                              ? "Claim this item"
                              : "Action not available"
                          }
                          placement="bottom"
                          arrow
                          disableHoverListener={false}
                        >
                          <Button
                            startIcon={<Check sx={{ fontSize: "1.2rem" }} />}
                            aria-label="claim"
                            onClick={handleClaimOpen}
                            sx={buttonStyle2}
                          >
                            Claim
                          </Button>
                        </Tooltip>
                      )}
                      {itemData?.itemStatus === "claimed" && (
                        <Tooltip
                          title={
                            itemData?.type === "found"
                              ? "Raise dispute for this item"
                              : "Action not available"
                          }
                          placement="bottom"
                          arrow
                          disableHoverListener={false}
                        >
                          <Button
                            startIcon={
                              <ErrorOutline sx={{ fontSize: "1.2rem" }} />
                            }
                            aria-label="Dispute"
                            onClick={handleDisputeOpen}
                            sx={buttonStyle2}
                          >
                            Dispute
                          </Button>
                        </Tooltip>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <DialogComponent
            open={openDelete}
            handleClose={handleDeleteClose}
            handleAction={handleDeleteAction}
            title="Delete Item"
            actionText="Are you sure you want to delete this item?"
          />

          <DialogComponent
            open={openClaim}
            handleClose={handleClaimClose}
            handleAction={handleClaimAction}
            title="Claim Item"
            actionText="Are you sure you want to claim this item?"
          />

          <DialogComponent
            open={openDispute}
            handleClose={handleDisputeClose}
            handleAction={handleDisputeAction}
            title="Raise Dispute"
            actionText="Are you sure you want to raise a dispute for this item?"
          />

          <DialogComponent
            open={respondClaimRequestModal}
            handleClose={() => setRespondClaimRequestModal(false)}
            handleAction={async (e) => {
              if (e === "accept") {
                const { data } = await confirmClaimRequest(
                  itemData._id,
                  claimRequestModalData?.userId
                );
                setItemData(data?.updatedItem);
                setRespondClaimRequestModal(false);
              } else if (e === "decline") {
                const { data } = await declineClaimRequest(
                  itemData._id,
                  claimRequestModalData?.userId
                );
                setItemData(data?.updatedItem);
                setRespondClaimRequestModal(false);
              }
            }}
            buttonCount={3}
            title="Respond to claim request"
            actionText="Respond to the claim request for this item?"
          />
        </Box>

        <Divider
          sx={{
            backgroundColor: "#ff9717",
            marginBottom: "10px",
          }}
        />

        <Grid
          container
          sx={{
            display: { xs: "block", sm: "block", md: "flex" },
            backgroundColor: "#4a5569",
            width: "100%",
            borderRadius: "10px",
            justifyContent: "space-between",
            padding: "0",
            margin: "0",
          }}
        >
          {/* Image */}
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={3.5}
            sx={{
              padding: "20px",
              display: "flex",
              alignContent: "space-between",
            }}
          >
            <Grid
              container
              xs={12}
              sx={{
                display: "flex",
                alignContent: "space-between",
              }}
            >
              <Grid item xs={12}>
                <CardMedia
                  component="img"
                  src={itemData?.imageUrl}
                  alt={itemData?.itemName}
                  sx={{
                    width: "100%",
                    height: "500px",
                    objectFit: "fill",
                    borderRadius: "10px",
                    boxShadow: "0 0px 10px #000",
                  }}
                />
              </Grid>

              {/* Edit Image Button */}
              <Grid item xs={12}>
                {editable && (
                  <Button
                    startIcon={<PhotoCamera />}
                    variant="contained"
                    sx={{
                      backgroundColor: "#ff9717",
                      color: "#1c2536",
                      fontSize: "1.2rem",
                      width: "100%",
                      marginTop: "10px",
                    }}
                    component="label"
                    onChange={handleModalView}
                  >
                    Edit Image
                  </Button>
                )}
              </Grid>
            </Grid>
            {UploadPictureModal()}
          </Grid>

          {/* Item Description - START */}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={8.5}>
            <Box
              sx={{
                padding: "5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                justifyContent: "center",
                margin: "7px",
              }}
            >
              {/* Item Name */}
              <InputLabel
                id={`${params.id}-label-itemName`}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                }}
              >
                Item Name
              </InputLabel>
              <Input
                label="Item Name"
                defaultValue={itemData?.itemName}
                disabled={!editable}
                onChange={(e) =>
                  setUpdatedItemData((prev) => ({
                    ...prev,
                    itemName: e.target.value,
                  }))
                }
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  marginBottom: "20px",
                }}
              />

              {/* Item Description */}
              <InputLabel
                id={`${params.id}-label-itemDescription`}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                }}
              >
                Item Description
              </InputLabel>
              <Input
                label="Item Description"
                defaultValue={itemData?.description}
                disabled={!editable}
                onChange={(e) =>
                  setUpdatedItemData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  marginBottom: "20px",
                }}
              />

              {/* Item Location */}
              <InputLabel
                id={`${params.id}-label-itemLocation`}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                }}
              >
                {itemData?.type === "lost" ? "Lost Location" : "Found Location"}
              </InputLabel>
              <Input
                label="Item Location"
                defaultValue={itemData?.lastSeenLocation}
                disabled={!editable}
                onChange={(e) =>
                  setUpdatedItemData((prev) => ({
                    ...prev,
                    lastSeenLocation: e.target.value,
                  }))
                }
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  marginBottom: "20px",
                }}
              />

              {/* Item Type */}
              <InputLabel
                id={`${params.id}-label-itemType`}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                }}
              >
                Type
              </InputLabel>
              <Input
                label="Item Type"
                defaultValue={itemData?.type}
                disabled={!editable}
                onChange={(e) =>
                  setUpdatedItemData((prev) => ({
                    ...prev,
                    itemType: e.target.value,
                  }))
                }
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  marginBottom: "20px",
                }}
              />

              {/* Item Status */}
              <InputLabel
                id={`${params.id}-label-itemStatus`}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                }}
              >
                Status
              </InputLabel>
              <Input
                label="Item Status"
                defaultValue={itemData?.itemStatus}
                disabled={!editable}
                onChange={(e) =>
                  setUpdatedItemData((prev) => ({
                    ...prev,
                    itemStatus: e.target.value,
                  }))
                }
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  marginBottom: "20px",
                }}
              />

              {/* Item Category */}
              <CustomSelect
                label="Category"
                value={itemData?.category}
                disabled={!editable}
              />

              {editable && (
                <Button
                  startIcon={<SaveAlt />}
                  variant="contained"
                  sx={{
                    backgroundColor: "#ff9717",
                    color: "#1c2536",
                    fontSize: "1.2rem",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  onClick={handleDataEdit}
                >
                  Update
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ backgroundColor: "#ff9717", margin: "10px 0px" }} />

        {/* Item Tags */}
        <Grid
          container
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            padding: "10px 10px",
            borderRadius: "10px",
            backgroundColor: "#4a5569",
          }}
        >
          <Grid item xs={12}>
            <Typography sx={titleStyleLight}>Tags</Typography>
          </Grid>
          <Grid item xs={12}>
            {itemData?.tags?.split(",")?.map((tag) => (
              <Chip
                key={tag}
                sx={{
                  backgroundColor: "#ff9717",
                  color: "#1c2536",
                  borderRadius: "50px",
                  marginRight: "5px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
                label={tag}
              />
            ))}
          </Grid>
        </Grid>

        <Divider
          sx={{
            backgroundColor: "#ff9717",
            margin: "10px 0px",
            display: {
              xs: "block",
              sm: "block",
              md: "none",
              lg: "none",
              xl: "none",
              "2xl": "none",
            },
          }}
        />

        <div className="xs:block sm:block hidden p-[10px] rounded-[10px] bg-[#4a5569]">
          <Typography sx={titleStyleLight}>Actions</Typography>
          <div className="sm:mt-[14px] xs:mb-[10px] sm:mb-[10px]">
            {itemData?.uid === userData?.user_firebase_id && (
              <>
                <Tooltip title="Edit this item" placement="bottom" arrow>
                  <Button
                    aria-label="edit"
                    onClick={handleEdit}
                    sx={buttonStyle2}
                  >
                    {editable ? (
                      <>
                        <CloseIcon sx={{ fontSize: "1.2rem" }} />
                        &nbsp;Cancel
                      </>
                    ) : (
                      <>
                        <Edit sx={{ fontSize: "1.2rem" }} />
                        &nbsp;Edit
                      </>
                    )}
                  </Button>
                </Tooltip>
                <Tooltip title="Delete this item" placement="bottom" arrow>
                  <Button
                    aria-label="delete"
                    onClick={handleDeleteOpen}
                    sx={buttonStyle2}
                  >
                    <Delete sx={{ fontSize: "1.2rem" }} />
                    &nbsp;Delete
                  </Button>
                </Tooltip>
              </>
            )}
            {itemData?.uid !== userData?.user_firebase_id && (
              <>
                {itemData?.type === "found" && (
                  <>
                    {itemData?.itemStatus === "reported" && (
                      <Tooltip
                        title={
                          itemData?.type === "found"
                            ? "Claim this item"
                            : "Action not available"
                        }
                        placement="bottom"
                        arrow
                        disableHoverListener={false}
                      >
                        <Button
                          startIcon={<Check />}
                          aria-label="claim"
                          onClick={handleClaimOpen}
                          sx={buttonStyle2}
                        >
                          Claim
                        </Button>
                      </Tooltip>
                    )}
                    {itemData?.itemStatus === "claimed" && (
                      <Tooltip
                        title={
                          itemData?.type === "found"
                            ? "Raise dispute for this item"
                            : "Action not available"
                        }
                        placement="bottom"
                        arrow
                        disableHoverListener={false}
                      >
                        <Button
                          startIcon={<ErrorOutline />}
                          aria-label="Dispute"
                          onClick={handleDisputeOpen}
                          sx={buttonStyle2}
                        >
                          Dispute
                        </Button>
                      </Tooltip>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <Divider sx={{ backgroundColor: "#ff9717", margin: "10px 0px" }} />

        {/* Timeline Tracker */}
        <TimelineTracker timeline={itemData?.timelineDetails} />

        <Divider sx={{ backgroundColor: "#ff9717", margin: "10px 0px" }} />

        {/* Claims and disputed Tabs */}
        <Grid
          container
          xs={12}
          sx={{
            display: { xs: "block", sm: "flex" },
            backgroundColor: "#4A5569",
            width: "100%",
            borderRadius: "10px",
            justifyContent: "space-between",
          }}
        >
          <Grid xs={12}>
            <ClaimsAndDisputes
              claims={itemData?.claims}
              disputes={itemData?.disputes}
              itemStatus={itemData?.itemStatus}
              handleRequestModal={handleRequestModal}
              showModalBtn={itemData?.uid === userData?.user_firebase_id}
            />
          </Grid>
        </Grid>

        <Divider sx={{ backgroundColor: "#ff9717", margin: "10px 0px" }} />

        {/* Comments Section */}
        <Comments
          comments={itemData?.comments}
          setItemData={setItemData}
          postId={itemData?._id}
          userId={userData?.user_firebase_id}
        />
      </LayoutProvider>
    );
  }
}

export default ItemDetails;
