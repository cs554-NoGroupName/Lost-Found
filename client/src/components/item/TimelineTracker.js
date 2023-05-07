import React from 'react';
import {
    Typography,
    Stepper,
    Step,
    StepLabel,
    Box
} from '@mui/material';

const titleStyle = {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: '#324b4b',
    marginBottom: '10px'
}

const TimelineTracker = ({ timeline }) => {
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
                <Typography sx={titleStyle}>Item Timeline</Typography>
                <Stepper
                    activeStep={timeline.length - 1}
                    orientation="horizontal"
                    alternativeLabel
                    sx={{
                        '& .MuiStepLabel-label.Mui-completed': {
                            backgroundColor: '#e6e6e6',
                            color: 'black',
                            borderRadius: '10px',
                            padding: '10px',
                            textAlign: 'left'
                        },
                        '& .MuiStepLabel-label.Mui-active': {
                            backgroundColor: '#e6e6e6',
                            color: 'black',
                            borderRadius: '10px',
                            padding: '10px',
                            textAlign: 'left',
                            border: '2px solid #ff9717'
                        },
                        '& .MuiStepConnector-horizontal': {
                            backgroundColor: '#2E3643'
                        },
                        '& .MuiSvgIcon-fontSizeMedium.MuiStepIcon-root.Mui-completed': {
                            color: '#4A5569'
                        },
                        '& .MuiSvgIcon-fontSizeMedium.MuiStepIcon-root.Mui-active': {
                            color: '#ff9717'
                        }
                    }}
                >
                    {timeline.map((item) => (
                        <Step key={item.id}>
                            <StepLabel>
                                <Box>
                                    <Typography sx={{ fontSize: '1rem' }}>Date: {item.date}</Typography>
                                    <Typography sx={{ fontSize: '1rem' }}>Location: {item.location}</Typography>
                                    <Typography sx={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>{item.description}</Typography>
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