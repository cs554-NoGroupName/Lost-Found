import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const titleStyle = {
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#324b4b",
  marginBottom: "10px",
};

const Comments = ({ comments }) => {
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
        <Typography sx={titleStyle}>Comments</Typography>
        {comments.map((comment) => (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <List sx={{ width: "100%" }}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      sx={{
                        "&:hover": {
                          backgroundColor: "#1c2536",
                          color: "#ff9717",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  divider
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={comment.user.name}
                      sx={{
                        backgroundColor: "#2E3643",
                        color: "#fff",
                      }}
                    >
                      {comment.user.name.charAt(0)}
                    </Avatar>
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
                          {comment.user.name}
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
                          {comment.date}
                        </Typography>
                      </React.Fragment>
                    }
                    disablePadding
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {comment.description}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        ))}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="outlined-multiline-static"
              label="Add Comment"
              sx={{
                marginTop: "10px",
              }}
              multiline
              rows={2}
              placeholder="Your comment goes here..."
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{
                float: "left",
                backgroundColor: "#1c2536",
                "&:hover": {
                  backgroundColor: "#01AD7B",
                },
              }}
            >
              Add Comment
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Comments;
