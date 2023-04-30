import React from 'react';
import {
    CardContent,
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
    Button
} from '@mui/material';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import BackHandIcon from '@mui/icons-material/BackHand';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const titleStyle = {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: 'rgb(100, 100, 100, 0.8)',
    marginBottom: '10px'
}

const ClaimsAndDisputes = ({ claims, disputes }) => {
    const [value, setValue] = React.useState('one');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <CardContent>
                <Typography sx={titleStyle}>Claims & Disputes</Typography>
                <Box sx={{
                    width: '100%',
                    color: '#fff',
                    borderRadius: '10px',
                    backgroundColor: 'rgb(54, 114, 114, 0.8)',
                }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="inherit"
                        sx={{
                            width: '100%'
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
                                            backgroundColor: 'rgb(54, 114, 114, 0.2)',
                                            borderRadius: '10px',
                                            marginBottom: '2px'
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt={claim.user.name} >
                                                {claim.user.name.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={claim.user.name}
                                            secondary={
                                                <>
                                                    <Typography
                                                        sx={{ display: 'inline-block', paddingRight: '10px' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {claim.date}
                                                    </Typography>
                                                    <Typography
                                                        sx={{ display: 'inline-block' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {claim.description}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        <Button variant="contained"
                                            startIcon={claim.status === 'Pending' ? <AssignmentReturnedIcon /> : <TaskAltIcon />}
                                            disabled
                                            sx={{
                                                float: 'right',
                                                width: '150px',
                                                height: '55px'
                                            }}>
                                            {claim.status}
                                        </Button>
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
                                            backgroundColor: 'rgb(54, 114, 114, 0.3)',
                                            borderRadius: '10px',
                                            marginBottom: '2px'
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt={dispute.user.name} >
                                                {dispute.user.name.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={dispute.user.name}
                                            secondary={
                                                <>
                                                    <Typography
                                                        sx={{ display: 'inline-block', paddingRight: '10px' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {dispute.date}
                                                    </Typography>
                                                    <Typography
                                                        sx={{ display: 'inline-block' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {dispute.description}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        <Button variant="contained"
                                            startIcon={dispute.status === 'Pending' ? <AssignmentReturnedIcon /> : <TaskAltIcon />}
                                            disabled
                                            sx={{
                                                float: 'right',
                                                width: '150px',
                                                height: '55px',
                                                backgroundColor: 'rgb(54, 114, 114, 0.9)'
                                            }}>
                                            {dispute.status}
                                        </Button>
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    ))}

                </Box>
            </CardContent>
        </>
    );
};

export default ClaimsAndDisputes;