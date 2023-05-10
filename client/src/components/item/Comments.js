import React, { useState } from "react";
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
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { addComment, deleteComment } from "utils/apis/item";
import moment from "moment";

const titleStyle = {
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#e6e6e6",
  marginBottom: "10px",
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
    color: "#1c2536",
    fontWeight: "600",
  },
};

const Comments = ({ postId, comments, setItemData, userId }) => {
  const [comment, setComment] = useState("");
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
        <Typography sx={titleStyle}>Comments</Typography>
        {comments?.length !== 0 ? (
          comments?.map((comment) => (
            <Grid container spacing={1} key={comment?._id}>
              <Grid item xs={12}>
                <List sx={{ width: "100%" }}>
                  <ListItem
                    sx={{
                      backgroundColor: "#e6e6e6",
                      borderRadius: "10px",
                    }}
                    key={comment?._id}
                    alignItems="flex-start"
                    secondaryAction={
                      userId === comment?.userId ? (
                        <IconButton
                          onClick={async () => {
                            const { status, data } = await deleteComment(
                              postId,
                              comment?._id
                            );
                            if (status !== 200)
                              toast.error("Failed to delete comment!");
                            else setItemData(data?.updatedItem);
                          }}
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
                      ) : null
                    }
                    divider
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={comment?.userDetails?.image_url}
                        alt={comment?.userDetails?.email}
                        sx={{
                          backgroundColor: "#2E3643",
                          color: "#fff",
                          width: "45px",
                          height: "45px",
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <div className="flex items-end">
                            <div className="text-lg font-[600]">
                              {comment?.userDetails?.firstName}{" "}
                              {comment?.userDetails?.lastName}
                            </div>
                            <div className="text-md ml-[12px]">
                              {moment(comment?.commentDate).format(
                                "MMMM Do YYYY, h:mm a"
                              )}
                            </div>
                          </div>
                        </React.Fragment>
                      }
                      disablePadding={true}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {comment?.comment}
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
            <Alert severity="info">No comments yet!</Alert>
          </div>
        )}
      </Box>
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
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={async () => {
              if (comment.trim() === "")
                toast.error("Seriously? An empty comment?");
              else {
                const { status, data } = await addComment(postId, {
                  comment,
                });
                if (status !== 200) toast.error("Failed to add comment!");
                else {
                  setItemData(data?.updatedItem);
                  setComment("");
                }
              }
            }}
            variant="contained"
            sx={{
              ...buttonStyle2,
              float: "left",
            }}
          >
            Add Comment
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Comments;
