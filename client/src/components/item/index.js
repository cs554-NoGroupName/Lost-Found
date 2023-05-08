import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Divider,
  //   TextField,
  Dialog,
  IconButton,
  Typography,
  CardMedia,
  Chip,
} from "@mui/material";

import LayoutProvider from "components/common/Layout";
import Comments from "./Comments";
// import TimelineTracker from "./TimelineTracker";
// import CustomSelect from "./CustomSelect";
import ClaimsAndDisputes from "./ClaimsAndDisputes";
import LoadingText from "components/common/loadingText";
// import { categoryOptions } from "utils/constants";
import { useSelector } from "react-redux";
import {
  Avatar,
  Tooltip,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import BackHandOutlinedIcon from "@mui/icons-material/BackHandOutlined";
import {
  comfirmClaimRequest,
  declineClaimRequest,
  deleteItemById,
  getItemDetailsById,
  sendClaimRequest,
} from "utils/apis/item";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import moment from "moment";

const buttonStyle = {
  borderRadius: "8px",
  padding: "8px",
  backgroundColor: "#1c2536",
  fontSize: "18px",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#ff9717",
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

const avatarStyle = {
  height: "40px",
  width: "40px",
  backgroundColor: "#1c2536",
  color: "#ff9717",
  fontWeight: "bold",
  fontSize: "2.5rem",
  marginRight: "10px",
};

const iconStyles = {
  fontSize: "25px",
  marginRight: "5px",
};

// const titleStyleLight = {
//   fontWeight: "bold",
//   fontSize: "1.5rem",
//   color: "#c8c8c8cc",
//   marginBottom: "10px",
// };

const titleStyleDark = {
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#1c2536",
  marginBottom: "10px",
};

function ItemDetails() {
  const userData = useSelector((state) => state?.userData?.userData);
  const params = useParams();
  const [itemData, setItemData] = useState({});
  const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState(null);
  //   const [editView, setEditView] = useState(false);
  const [openClaim, setOpenClaim] = useState(false);
  const [openDispute, setOpenDispute] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [claimRequestModalData, setClaimRequestModalData] = useState({});
  const [respondClaimRequestModal, setRespondClaimRequestModal] =
    useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getItemDetailsById(params.id).then((res) => {
      const { status, data } = res;
      if (status !== 200) {
        toast.error("Failed to fetch item details");
        // if (
        //   (status === 401) &
        //   (data.message === "Invalid authorization token.")
        // ) {
        //   toast.error("Session expired. Logging out...");
        //   dispatch(setUserData({ data: {} }));
        //   localStorage.setItem("token", null);
        //   navigate("/login");
        // }
      } else setItemData(data?.data);
      setLoading(false);
    });
  }, [params.id]);

  const DialogComponent = ({
    open,
    handleClose,
    handleAction,
    title,
    actionText,
    btns = 2,
  }) => {
    return (
      <div>
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
            {btns === 3 ? (
              <>
                <Button
                  onClick={() => handleAction("accept")}
                  startIcon={<ThumbUpOffAltIcon />}
                  sx={dialogButtonStyle}
                >
                  Accept
                </Button>
                <Button
                  onClick={() => handleAction("decline")}
                  startIcon={<ThumbDownOffAltIcon />}
                  sx={dialogButtonStyle}
                >
                  Decline
                </Button>
                <Button
                  onClick={handleClose}
                  startIcon={<CancelIcon />}
                  sx={dialogButtonStyle}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleAction}
                  startIcon={<ThumbUpOffAltIcon />}
                  sx={dialogButtonStyle}
                >
                  Confirm
                </Button>
                <Button
                  onClick={handleClose}
                  startIcon={<CancelIcon />}
                  sx={dialogButtonStyle}
                >
                  Cancel
                </Button>{" "}
              </>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  //   const Text = ({ label, value }) => {
  //     return (
  //       <>
  //         <TextField
  //           label={label}
  //           defaultValue={value}
  //           fullWidth
  //           disabled={!editView}
  //           sx={{
  //             marginBottom: "20px",
  //             display: { xs: "none", sm: "block" },
  //             justifyContent: "space-between",
  //             "& .MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled": {
  //               "-webkit-text-fill-color": "#e6e6e6",
  //             },
  //           }}
  //           InputProps={{
  //             sx: {
  //               color: "#e6e6e6",
  //               fontSize: "1rem",
  //             },
  //           }}
  //           InputLabelProps={{
  //             style: {
  //               color: "#fff",
  //               fontWeight: "bold",
  //               fontSize: "1.3rem",
  //             },
  //           }}
  //         />
  //       </>
  //     );
  //   };

  const handleRequestModal = (type, item) => {
    if (type === "claim") {
      setClaimRequestModalData(item);
      setRespondClaimRequestModal(true);
    }
  };

  if (loading) {
    return (
      <LayoutProvider>
        <LoadingText />
      </LayoutProvider>
    );
    //   }
    //   else if (error) {
    //     return (
    //       <LayoutProvider>
    //         <h2> Error loading item details: </h2>
    //         <h4> {error} </h4>
    //       </LayoutProvider>
    //     );
  } else {
    return (
      <LayoutProvider>
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
                    <IconButton
                      aria-label="edit"
                      //   onClick={() => setEditView(true)}
                      onClick={() => {}}
                      sx={{ ...buttonStyle, marginRight: "8px" }}
                    >
                      <EditIcon sx={iconStyles} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete this item" placement="bottom" arrow>
                    <IconButton
                      aria-label="delete"
                      onClick={() => setOpenDelete(true)}
                      sx={{ ...buttonStyle, marginRight: "8px" }}
                    >
                      <DeleteIcon sx={iconStyles} />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {itemData?.uid !== userData?.user_firebase_id && (
                <>
                  {itemData?.type === "found" && (
                    <>
                      {itemData?.itemStatus === "reported" && (
                        <Tooltip
                          title="Claim this item"
                          placement="bottom"
                          arrow
                        >
                          <IconButton
                            aria-label="claim"
                            onClick={() => setOpenClaim(true)}
                            sx={{ ...buttonStyle, marginRight: "8px" }}
                          >
                            <GavelRoundedIcon sx={iconStyles} /> Request Claim
                          </IconButton>
                        </Tooltip>
                      )}
                      {itemData?.itemStatus === "claimed" && (
                        <Tooltip title="Raise dispute" placement="bottom" arrow>
                          <IconButton
                            aria-label="Dispute"
                            onClick={() => setOpenDispute(true)}
                            sx={buttonStyle}
                          >
                            <BackHandOutlinedIcon sx={iconStyles} /> Raise
                            Dispute
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </Box>
        <DialogComponent
          open={openDelete}
          handleClose={() => setOpenDelete(false)}
          handleAction={async () => {
            const { status, data } = await deleteItemById(itemData?._id);
            console.log(status, data);
            if (status === 200) {
              toast.success("Post deleted!");
              navigate("/profile");
            } else {
              toast.error("Failed to delete item!");
              setOpenDelete(false);
            }
          }}
          title="Delete Item"
          actionText="Are you sure you want to delete this item?"
        />

        <DialogComponent
          open={openClaim}
          handleClose={() => setOpenClaim(false)}
          handleAction={async (e) => {
            const { status, data } = await sendClaimRequest(itemData._id);
            setOpenClaim(false);
            if (status === 200) {
              setItemData(data?.updatedItem);
              toast.success("Claim request sent.");
            } else toast.info(data.error);
          }}
          title="Claim Item"
          actionText="Are you sure you want to claim this item?"
        />

        <DialogComponent
          open={respondClaimRequestModal}
          handleClose={() => setRespondClaimRequestModal(false)}
          handleAction={async (e) => {
            if (e === "accept") {
              const { data } = await comfirmClaimRequest(
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
          btns={3}
          title="Respond to claim request"
          actionText="Respond to the claim request for this item?"
        />

        {/* <DialogComponent
        open={openDispute}
        handleClose={setOpenClaim(false)}
        handleAction={(e) => console.log("confirmed Dispute")}
        title="Raise Dispute"
        actionText="Are you sure you want to raise a dispute for this item?"
      /> */}
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
            backgroundColor: "#95b1b0",
            width: "100%",
            borderRadius: "10px",
            justifyContent: "space-between",
            padding: "0",
            margin: "0",
          }}
        >
          {/* Image Carousel */}
          <Grid xs={12} sm={12} md={6} lg={4} xl={3}>
            <Box
              sx={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                src={itemData?.imageUrl}
                alt={itemData?.itemName}
                sx={{
                  //   height: "280px",
                  width: "fit-content",
                  objectFit: "contain",
                  borderRadius: "10px",
                  boxShadow: "0 0px 10px #000",
                }}
              />
            </Box>
          </Grid>

          {/* Item Description - START */}
          <Grid item xs={12} sm={12} md={6} lg={8} xl={9}>
            <Box sx={{ padding: "10px" }}>
              <Typography sx={titleStyleDark}>Overview</Typography>
              <div className="text-logoBlue">
                <div className="text-3xl font-[600]">{itemData?.itemName}</div>
                <div className="text-xl">{itemData?.description}</div>
                <div className="text-xl">Type: {itemData?.type}</div>
                <div className="text-xl">Category: {itemData?.category}</div>
                <div className="text-xl">
                  {itemData?.type?.charAt(0).toUpperCase() +
                    itemData?.type?.slice(1)}{" "}
                  Location: {itemData?.lastSeenLocation}
                </div>
                <div className="text-xl">Tags</div>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                    maxWidth: "300px",
                  }}
                >
                  {itemData?.tags?.split(",")?.map((tag) => (
                    <Chip
                      key={tag}
                      sx={{
                        backgroundColor: "#1c2536",
                        color: "#ff9717",
                        borderRadius: "50px",
                        marginRight: "5px",
                        fontSize: "1rem",
                        marginBottom: "5px",
                      }}
                      label={tag}
                    />
                  ))}

                  <div className="text-xl">
                    {" "}
                    Status:
                    <Chip label={itemData?.itemStatus} />
                  </div>
                </Box>
              </div>
            </Box>
          </Grid>
          {/* Item Description - END */}
        </Grid>
        {/* TimelineTracker */}
        <div className="xs:block sm:block hidden xs:mb-[10px] sm:mb-[10px]">
          <Divider sx={{ backgroundColor: "#ff9717", margin: "10px 0px" }} />
          <Typography sx={titleStyleDark}>Actions</Typography>
          <div className="xs:flex sm:flex hidden  justify-items-start w-full">
            {itemData?.uid === userData?.user_firebase_id && (
              <>
                <Tooltip title="Edit this item" placement="bottom" arrow>
                  <IconButton
                    aria-label="edit"
                    // onClick={() => setEditView(true)}
                    onClick={() => {}}
                    sx={{ ...buttonStyle, marginRight: "8px" }}
                  >
                    <EditIcon sx={iconStyles} /> Edit details
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete this item" placement="bottom" arrow>
                  <IconButton
                    aria-label="delete"
                    onClick={() => setOpenDelete(true)}
                    sx={{ ...buttonStyle, marginRight: "8px" }}
                  >
                    <DeleteIcon sx={iconStyles} /> Delete post
                  </IconButton>
                </Tooltip>
              </>
            )}

            {itemData?.uid !== userData?.user_firebase_id && (
              <>
                {itemData?.type === "found" && (
                  <>
                    {itemData?.itemStatus === "reported" && (
                      <Tooltip title="Claim this item" placement="bottom" arrow>
                        <IconButton
                          aria-label="claim"
                          onClick={() => setOpenClaim(true)}
                          sx={{ ...buttonStyle, marginRight: "8px" }}
                        >
                          <GavelRoundedIcon sx={iconStyles} /> Request Claim
                        </IconButton>
                      </Tooltip>
                    )}
                    {itemData?.itemStatus === "claimed" && (
                      <Tooltip title="Raise dispute" placement="bottom" arrow>
                        <IconButton
                          aria-label="Dispute"
                          onClick={() => openDispute()}
                          sx={buttonStyle}
                        >
                          <BackHandOutlinedIcon sx={iconStyles} /> Raise Dispute
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {/* <TimelineTracker timeline={itemData.timelineDetails} /> */}
        {itemData?.type === "found" && (
          <>
            <Divider sx={{ backgroundColor: "#ff9717", margin: "10px 0px" }} />
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
          </>
        )}
        {/* Claims and disputed Tabs */}
        <Divider sx={{ backgroundColor: "#ff9717", marginTop: "20px" }} />
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

// details form
// Item Name
//               <Text label="Item Name" value={itemData.itemName} />

//               {/* Item Description */}
//               <Text label="Description" value={itemData.description} />

//               {/* Item Reporter */}
//               {/* <Text label="Reported By" value={itemData.reportedBy} /> */}

//               {/* Item Description */}
//               {/* <Text label="Reported On" value={itemData.reportedDate} /> */}

//               {/* Item Location */}
//               {itemData.type === "Lost" && itemData.lastSeenLocation && (
//                 <Text
//                   label="Reported Location of the Item"
//                   value={itemData.lastSeenLocation}
//                 />
//               )}
//               {itemData.type === "Found" && itemData.lastSeenLocation && (
//                 <Text
//                   label="Current Location of the Item"
//                   value={itemData.lastSeenLocation}
//                 />
//               )}

//               <div className="flex justify-between">
//                 <Grid item xs={7}>
//                   <CustomSelect
//                     id="item-category"
//                     label="Item Category"
//                     value={itemData.category}
//                     disabled={!editView}
//                     itemList={categoryOptions}
//                   />
//                 </Grid>
//                 <Grid item xs={4}>
//                   <CustomSelect
//                     id="item-type"
//                     label="Item Type"
//                     value={itemData.type}
//                     disabled={!editView}
//                     itemList={itemTypeList}
//                   />
//                 </Grid>
//               </div>
