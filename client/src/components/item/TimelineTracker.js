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
import "./styles.css";

const titleStyle = {
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#e6e6e6",
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
          padding: "10px 10px",
          borderRadius: "10px",
          backgroundColor: "#4a5569",
        }}
      >
        <Typography sx={titleStyle}>Item Timeline</Typography>
        <Stepper
          classes={"blinking_effect"}
          activeStep={timeline?.length - 1}
          orientation="horizontal"
          alternativeLabel
          sx={{
            display: { xs: "block", sm: "block", md: "flex" },
            alignItems: "center",
            width: "max-content",
            "& .MuiStepLabel-label.Mui-completed ": {
              backgroundColor: "#e6e6e6",
              color: "black",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "left",
              width: "max-content",
            },
            "& .MuiStepLabel-label.Mui-active": {
              backgroundColor: "#e6e6e6",
              color: "black",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "left",
              border: "2px solid #ff9717",
              width: "max-content",
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
                  <Typography sx={{ fontSize: "1.2rem", fontWeight: "700" }}>
                    Date: {moment(item?.date).format("MMMM Do YYYY, h:mm a")}
                  </Typography>
                  <Typography sx={{ fontSize: "1.2rem", fontWeight: "700" }}>
                    Status: {item?.status}
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      fontSize: "1rem",
                      marginTop: "0.5rem",
                      alignItems: "center",
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
