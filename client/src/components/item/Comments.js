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
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { addComment, deleteComment } from "utils/apis/item";
import moment from "moment";

const titleStyle = {
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#324b4b",
  marginBottom: "10px",
};

const Comments = ({ postId, comments, setItemData, userId }) => {
  const [comment, setComment] = React.useState("");
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
        {comments?.length !== 0 ? (
          comments?.map((comment) => (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <List sx={{ width: "100%" }}>
                  <ListItem
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
                            {comment?.userDetails?.firstName}{" "}
                            {comment?.userDetails?.lastName}
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
                            {moment(comment?.commentDate).format(
                              "MMMM Do YYYY, h:mm a"
                            )}
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
            <Alert severity="info">No comments!</Alert>
          </div>
        )}
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
                setComment(e.target.value.trim());
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
