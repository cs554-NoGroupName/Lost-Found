import React from 'react';
import {
    CardContent,
    Typography,
    Grid,
    Button,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const titleStyle = {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: 'rgb(100, 100, 100, 0.8)',
    marginBottom: '10px'
}

const Comments = ({ comments }) => {
    return (
        <>
            <CardContent>
                <Typography sx={titleStyle}>Comments</Typography>
                {comments.map((comment) => (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <List sx={{ width: '100%' }}>
                                <ListItem
                                    alignItems="flex-start"
                                    sx={{
                                        backgroundColor: 'rgb(54, 114, 114, 0.1)',
                                        borderRadius: '10px',
                                        marginBottom: '2px'
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar alt={comment.user.name} >
                                            {comment.user.name.charAt(0)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={comment.user.name}
                                        secondary={
                                            <>
                                                <Typography
                                                    sx={{ display: 'inline-block', paddingRight: '10px' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {comment.date}
                                                </Typography>
                                                <Typography
                                                    sx={{ display: 'inline-block' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {comment.description}
                                                </Typography>
                                            </>
                                        }
                                    />
                                    <Button variant="contained"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => console.log('delete comment')}
                                        sx={{
                                            float: 'right',
                                            width: '150px',
                                            height: '55px',
                                            backgroundColor: 'rgb(54, 114, 114, 0.9)',
                                            '&:hover': {
                                                backgroundColor: '#01AD7B',
                                            },
                                        }}>
                                        Delete
                                    </Button>
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
                                marginTop: '20px',
                            }}
                            multiline
                            rows={2}
                            placeholder="Your comment goes here..."
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained"
                            sx={{
                                float: 'left',
                                backgroundColor: 'rgb(54, 114, 114, 0.9)',
                                '&:hover': {
                                    backgroundColor: '#01AD7B',
                                },
                            }}>Add Comment</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </>
    );
};

export default Comments;
