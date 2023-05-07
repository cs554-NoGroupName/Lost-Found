import React from 'react';
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
    Tooltip
} from '@mui/material';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import BackHandIcon from '@mui/icons-material/BackHand';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const titleStyle = {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: '#e6e6e6',
    marginBottom: '10px'
}

const ClaimsAndDisputes = ({ claims, disputes }) => {
    const [value, setValue] = React.useState('one');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    margin: '10px'
                }}
            >
                <Typography sx={titleStyle}>Claims & Disputes</Typography>
                <Box sx={{
                    width: '100%',
                    color: '#fff',
                    borderRadius: '10px',
                    backgroundColor: '#4A5569',
                }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="inherit"
                        sx={{
                            width: '100%',
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#ff9717'
                            },
                            '& .MuiTab-root': {
                                color: '#fff',
                                '&:hover': {
                                    color: '#ff9717'
                                }
                            }
                        }}
                    >
                        <Tab icon={<AssignmentReturnedIcon />} value="claims" label="Claims" />
                        <Tab icon={<BackHandIcon />} value="disputes" label="Disputes" />
                    </Tabs>

                    {value === 'claims' && claims.length > 0 && claims.map((claim) => (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <List sx={{ width: '100%' }}>
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{
                                            backgroundColor: '#e6e6e6',
                                            borderRadius: '10px'
                                        }}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="status"
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: '#1c2536',
                                                        color: '#ff9717'
                                                    }
                                                }}
                                            >
                                                {claim.status === 'Pending' && <Tooltip title="Pending"><AssignmentReturnedIcon /></Tooltip>}
                                                {claim.status === 'Resolved' && <Tooltip title="Resolved"><TaskAltIcon /></Tooltip>}
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt={claim.user.name}
                                                sx={{
                                                    backgroundColor: '#2E3643',
                                                    color: '#fff',
                                                }}
                                            >
                                                {claim.user.name.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline', paddingRight: '15px' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {claim.user.name}
                                                    </Typography>

                                                    <Typography
                                                        sx={{ display: 'inline', paddingRight: '15px' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        |
                                                    </Typography>

                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {claim.date}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline-block' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {claim.description}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    ))}

                    {value === 'disputes' && disputes.length > 0 && disputes.map((dispute) => (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <List sx={{ width: '100%' }}>
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{
                                            backgroundColor: '#e6e6e6',
                                            borderRadius: '10px'
                                        }}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="status"
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: '#1c2536',
                                                        color: '#ff9717'
                                                    }
                                                }}
                                            >
                                                {dispute.status === 'Pending' && <Tooltip title="Pending"><AssignmentReturnedIcon /></Tooltip>}
                                                {dispute.status === 'Resolved' && <Tooltip title="Resolved"><TaskAltIcon /></Tooltip>}
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt={dispute.user.name} >
                                                {dispute.user.name.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline', paddingRight: '15px' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {dispute.user.name}
                                                    </Typography>

                                                    <Typography
                                                        sx={{ display: 'inline', paddingRight: '15px' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        |
                                                    </Typography>

                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {dispute.date}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline-block' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {dispute.description}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    ))}
                </Box>
            </Box>
        </>
    );
};

export default ClaimsAndDisputes;