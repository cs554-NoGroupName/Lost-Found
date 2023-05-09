import React from "react";
import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Avatar,
} from "@mui/material";
import moment from "moment";

const titleStyle = {
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#324b4b",
  marginBottom: "10px",
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

const TimelineTracker = ({ timeline }) => {
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
        <Typography sx={titleStyle}>Item Timeline</Typography>
        <Stepper
          activeStep={timeline?.length - 1}
          orientation="horizontal"
          alternativeLabel
          sx={{
            display: { xs: "block", sm: "block", md: "flex" },
            "& .MuiStepLabel-label.Mui-completed": {
              backgroundColor: "#e6e6e6",
              color: "black",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "left",
            },
            "& .MuiStepLabel-label.Mui-active": {
              backgroundColor: "#e6e6e6",
              color: "black",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "left",
              border: "2px solid #ff9717",
            },
            "& .MuiStepConnector-horizontal": {
              backgroundColor: "#2E3643",
            },
            "& .MuiSvgIcon-fontSizeMedium.MuiStepIcon-root.Mui-completed": {
              color: "#4A5569",
            },
            "& .MuiSvgIcon-fontSizeMedium.MuiStepIcon-root.Mui-active": {
              color: "#ff9717",
            },
          }}
        >
          {timeline?.map((item) => (
            <Step key={item?.id}>
              <StepLabel>
                <Box>
                  <Typography sx={{ fontSize: "1.2rem" }}>
                    Date: {moment(item?.date).format("MMMM Do YYYY, h:mm a")}
                  </Typography>
                  <Typography sx={{ fontSize: "1.2rem" }}>
                    Status: {item?.status}
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      fontSize: "1rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <div>
                      <Avatar
                        sx={avatarStyle}
                        src={item?.userDetails?.image_url}
                      />
                    </div>
                    <div>
                      <div className="text-xl font-bold">
                        {item?.userDetails?.firstName}{" "}
                        {item?.userDetails?.lastName}
                      </div>
                    </div>
                  </Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </>
  );
};

export default TimelineTracker;