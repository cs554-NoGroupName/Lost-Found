import React from "react";
import {
  Typography,
  Tabs,
  Tab,
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import BackHandIcon from "@mui/icons-material/BackHand";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import RecommendIcon from "@mui/icons-material/Recommend";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import moment from "moment";

const titleStyle = {
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#e6e6e6",
  marginBottom: "10px",
};

const ClaimsAndDisputes = ({
  claims,
  disputes,
  itemStatus,
  handleRequestModal,
  showModalBtn,
}) => {
  const [value, setValue] = React.useState("claims");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "10px",
        }}
      >
        <Typography sx={titleStyle}>Claims & Disputes</Typography>
        <Box
          sx={{
            width: "100%",
            color: "#fff",
            borderRadius: "10px",
            backgroundColor: "#4A5569",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            sx={{
              width: "100%",
              "& .MuiTabs-indicator": {
                backgroundColor: "#ff9717",
              },
              "& .MuiTab-root": {
                color: "#fff",
                "&:hover": {
                  color: "#ff9717",
                },
              },
            }}
          >
            <Tab
              icon={<AssignmentReturnedIcon />}
              value="claims"
              label="Claims"
            />
            <Tab
              icon={<BackHandIcon />}
              value="disputes"
              label="Disputes"
              disabled={itemStatus !== "claimed"}
            />
          </Tabs>

          {value === "claims" ? (
            claims?.length > 0 ? (
              claims?.map((item) => (
                <Grid container spacing={2} key={item?.claimDate}>
                  <Grid item xs={12}>
                    <List sx={{ width: "100%" }}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{
                          backgroundColor: "#e6e6e6",
                          borderRadius: "10px",
                        }}
                        secondaryAction={
                          <IconButton
                            onClick={() => {
                              if (itemStatus !== "claimed" && showModalBtn)
                                handleRequestModal("claim", item);
                            }}
                            edge="end"
                            aria-label="status"
                            sx={{
                              "&:hover": {
                                backgroundColor: "#1c2536",
                                color: "#ff9717",
                              },
                            }}
                          >
                            {item?.claimStatus === "pending" && (
                              <Tooltip title="Pending">
                                <HourglassBottomIcon />
                              </Tooltip>
                            )}
                            {item?.claimStatus === "approved" && (
                              <Tooltip title="Claimed">
                                <RecommendIcon />
                              </Tooltip>
                            )}
                            {item?.claimStatus === "rejected" && (
                              <Tooltip title="Rejected">
                                <ThumbDownAltIcon />
                              </Tooltip>
                            )}
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={item?.userDetails?.image_url}
                            alt={item?.userDetails?.email}
                            sx={{
                              width: "50px",
                              height: "50px",
                              marginRight: "8px",
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <React.Fragment>
                              <Typography
                                sx={{
                                  display: "inline",
                                  paddingRight: "15px",
                                  color: "#4a5569",
                                  fontWeight: 600,
                                  fontSize: "1.1rem",
                                }}
                              >
                                {item?.userDetails?.firstName}{" "}
                                {item?.userDetails?.lastName}
                              </Typography>

                              {/* <Typography
                              sx={{ display: "inline", paddingRight: "15px", color: '#4a5569',fontWeight: 600,
                              fontSize: '1.4rem' }}
                            >
                              |
                            </Typography> */}

                              <Typography
                                sx={{
                                  display: "inline",
                                  color: "#4a5569",
                                  fontSize: "1.1rem",
                                }}
                              >
                                {moment(item?.claimDate).format(
                                  "MMMM Do YYYY, h:mm a"
                                )}
                              </Typography>
                            </React.Fragment>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{
                                  display: "inline-block",
                                  color: "#4a5569",
                                  fontWeight: 800,
                                  fontSize: "1.1rem",
                                }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                Status: {item?.claimStatus.toUpperCase()}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              ))
            ) : (
              <div className="m-[8px 0px]">
                <Alert severity="info">No claims to show!</Alert>
              </div>
            )
          ) : null}

          {value === "disputes" ? (
            disputes?.length > 0 ? (
              disputes?.map((item) => (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <List sx={{ width: "100%" }}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{
                          backgroundColor: "#e6e6e6",
                          borderRadius: "10px",
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="status"
                            sx={{
                              "&:hover": {
                                backgroundColor: "#1c2536",
                                color: "#ff9717",
                              },
                            }}
                          >
                            {item?.disputeStatus === "pending" && (
                              <Tooltip title="Pending">
                                <HourglassBottomIcon />
                              </Tooltip>
                            )}
                            {item?.claimStatus === "resolved" && (
                              <Tooltip title="Resolved">
                                <RecommendIcon />
                              </Tooltip>
                            )}
                            {item?.claimStatus === "declined" && (
                              <Tooltip title="Declined">
                                <ThumbDownAltIcon />
                              </Tooltip>
                            )}
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={item?.userDetails?.image_url}
                            alt={item?.userDetails?.email}
                            sx={{
                              backgroundColor: "#2E3643",
                              color: "#fff",
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: "inline", paddingRight: "15px" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {item?.userDetails?.firstName}{" "}
                                {item?.userDetails?.lastName}
                                <div></div>
                              </Typography>

                              <Typography
                                sx={{ display: "inline", paddingRight: "15px" }}
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                |
                              </Typography>

                              <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {moment(item?.claimDate).format(
                                  "MMMM Do YYYY, h:mm:ss a"
                                )}
                              </Typography>
                            </React.Fragment>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: "inline-block" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {item?.description}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              ))
            ) : (
              <div className="m-[8px 0px]">
                <Alert severity="info">No disputes to show!</Alert>
              </div>
            )
          ) : null}
        </Box>
      </Box>
    </>
  );
};

export default ClaimsAndDisputes;
// secondary={
//     <React.Fragment>
//       <Typography
//         sx={{ display: "inline-block" }}
//         component="span"
//         variant="body2"
//         color="text.primary"
//       >
//         {dispute.description}
//       </Typography>
//     </React.Fragment>
//   }
