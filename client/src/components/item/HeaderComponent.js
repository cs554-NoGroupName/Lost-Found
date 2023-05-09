// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Avatar,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
//   Divider,
//   Box,
// } from "@mui/material";
// import {
//   Edit,
//   Delete,
//   Check,
//   ThumbUpOffAlt,
//   ThumbDownOffAlt,
//   ErrorOutline,
//   Cancel,
// } from "@mui/icons-material";
// import {
//   deleteItemById,
//   sendClaimRequest,
//   confirmClaimRequest,
//   declineClaimRequest,
// } from "utils/apis/item";
// import { toast } from "react-toastify";
// import moment from "moment";

// const buttonStyle1 = {
//   height: "45px",
//   width: "45px",
//   borderRadius: "50%",
//   backgroundColor: "#1c2536",
//   color: "#fff",
//   fontSize: "12px",
//   padding: "4px",
//   "&:hover": {
//     backgroundColor: "#ff9717",
//   },
// };

// const avatarStyle = {
//   height: "55px",
//   width: "55px",
//   backgroundColor: "#1c2536",
//   color: "#ff9717",
//   fontWeight: "bold",
//   fontSize: "2.5rem",
//   marginRight: "10px",
// };

// const buttonStyle2 = {
//   height: "40px",
//   width: "90px",
//   borderRadius: "15px",
//   backgroundColor: "#1c2536",
//   fontSize: "11px",
//   padding: "4px 12px",
//   color: "#fff",
//   "&:hover": {
//     backgroundColor: "#ff9717",
//   },
// };

// const dialogButtonStyle = {
//   color: "#fff",
//   border: "2px solid #ff9717",
//   width: "150px",
//   "&:hover": {
//     backgroundColor: "#ff9717",
//   },
// };

// const DialogComponent = ({
//   open,
//   handleClose,
//   handleAction,
//   title,
//   actionText,
//   buttonCount,
// }) => {
//   return (
//     <div>
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         sx={{
//           "& .MuiDialog-paper": {
//             backgroundColor: "#4A5569",
//             color: "#fff",
//             borderRadius: "10px",
//             padding: "5px",
//             maxWidth: "600px",
//           },
//         }}
//       >
//         <DialogTitle>{title}</DialogTitle>
//         <Divider
//           sx={{
//             backgroundColor: "#ff9717",
//             marginBottom: "10px",
//           }}
//         />
//         <DialogContent>
//           <DialogContentText
//             sx={{
//               fontSize: "1.2rem",
//               color: "#e6e6e6",
//             }}
//           >
//             {actionText}
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           {buttonCount === 3 ? (
//             <>
//               <Button
//                 onClick={() => handleAction("accept")}
//                 startIcon={<ThumbUpOffAlt />}
//                 sx={dialogButtonStyle}
//               >
//                 Accept
//               </Button>
//               <Button
//                 onClick={() => handleAction("decline")}
//                 startIcon={<ThumbDownOffAlt />}
//                 sx={dialogButtonStyle}
//               >
//                 Decline
//               </Button>
//               <Button
//                 onClick={handleClose}
//                 startIcon={<Cancel />}
//                 sx={dialogButtonStyle}
//               >
//                 Cancel
//               </Button>
//             </>
//           ) : (
//             <>
//               <Button
//                 onClick={handleAction}
//                 startIcon={<ThumbUpOffAlt />}
//                 sx={dialogButtonStyle}
//               >
//                 Confirm
//               </Button>
//               <Button
//                 onClick={handleClose}
//                 startIcon={<Cancel />}
//                 sx={dialogButtonStyle}
//               >
//                 Cancel
//               </Button>{" "}
//             </>
//           )}
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// function Header({
//   itemData,
//   editable,
//   setEditable,
//   respondClaimRequestModal,
//   setRespondClaimRequestModal,
//   claimRequestModalData,
//   setItemData,
//   user_firebase_id,
// }) {
//   const navigate = useNavigate();

//   const [openClaim, setOpenClaim] = useState(false);
//   const [openDispute, setOpenDispute] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);

//   const handleEdit = () => {
//     setEditable(!editable);
//   };

//   const handleDeleteOpen = () => {
//     setOpenDelete(true);
//   };

//   const handleDeleteClose = () => {
//     setOpenDelete(false);
//   };

//   const handleClaimOpen = () => {
//     if (itemData?.type === "found" && itemData?.itemStatus === "reported") {
//       setOpenClaim(true);
//     } else {
//       toast.info("Action not available");
//     }
//   };

//   const handleClaimClose = () => {
//     setOpenClaim(false);
//   };

//   const handleDisputeOpen = () => {
//     if (itemData?.type === "found" && itemData?.itemStatus === "claimed") {
//       setOpenDispute(true);
//     } else {
//       toast.info("Action not available");
//     }
//   };

//   const handleDisputeClose = () => {
//     setOpenDispute(false);
//   };

//   const handleDeleteAction = async () => {
//     const { status, data } = await deleteItemById(itemData?._id);
//     console.log(status, data);
//     if (status === 200) {
//       toast.success("Post deleted!");
//       navigate("/profile");
//     } else {
//       toast.error("Failed to delete item!");
//       setOpenDelete(false);
//     }
//   };

//   const handleClaimAction = async () => {
//     const { status, data } = await sendClaimRequest(itemData?._id);
//     setOpenClaim(false);
//     if (status === 200) {
//       // setItemData(data?.updatedItem);
//       toast.success("Claim request sent.");
//     } else toast.info(data.error);
//   };

//   const handleDisputeAction = () => {
//     setOpenDispute(false);
//   };

//   return (

//   );
// }

// export default Header;

// // {true ?
// //   ) : ( */}
// //     <CardHeader */}
// //       sx={{
// //         width: "100%",
// //         justifyContent: "space-between",
// //         padding: "0",
// //         marginBottom: "10px",
// //       }}
// //       avatar={
// //         <Avatar
// //           sx={{
// //             height: "90px",
// //             width: "90px",
// //             backgroundColor: "#1c2536",
// //             color: "#ff9717",
// //             fontWeight: "bold",
// //             fontSize: "2.5rem",
// //           }}
// //           src={itemData?.reportedBy?.image_url}
// //         />
// //       }
// //       title={
// //         itemData?.reportedBy?.firstName +
// //         " " +
// //         itemData?.reportedBy?.lastName
// //       }
// //       subheader={moment(itemData?.reportedDate).format(
// //         "MMMM Do YYYY, h:mm a"
// //       )}
// //       action={
// //         <CardActions>
// //           <Tooltip title="Edit this item" placement="bottom" arrow>
// //             <IconButton
// //               aria-label="edit"
// //               onClick={handleEdit}
// //               sx={buttonStyle1}
// //             >
// //               <Edit />
// //             </IconButton>
// //           </Tooltip>
// //           <Tooltip title="Delete this item" placement="bottom" arrow>
// //             <IconButton
// //               aria-label="delete"
// //               onClick={handleDeleteOpen}
// //               sx={buttonStyle1}
// //             >
// //               <Delete />
// //             </IconButton>
// //           </Tooltip>
// //           <Tooltip
// //             title={
// //               itemData?.type === "found"
// //                 ? "Claim this item"
// //                 : "Action not available"
// //             }
// //             placement="bottom"
// //             arrow
// //             disableHoverListener={false}
// //           >
// //             <Button
// //               startIcon={<Check />}
// //               aria-label="claim"
// //               onClick={handleClaimOpen}
// //               sx={buttonStyle2}
// //             >
// //               Claim
// //             </Button>
// //           </Tooltip>
// //           <Tooltip
// //             title={
// //               itemData?.type === "found"
// //                 ? "Raise dispute for this item"
// //                 : "Action not available"
// //             }
// //             placement="bottom"
// //             arrow
// //             disableHoverListener={false}
// //           >
// //             <Button
// //               startIcon={<ErrorOutline />}
// //               aria-label="Dispute"
// //               onClick={handleDisputeOpen}
// //               sx={buttonStyle2}
// //             >
// //               Dispute
// //             </Button>
// //           </Tooltip>
// //         </CardActions>
// //       }
// //     />
// //   )}
