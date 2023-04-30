import React from 'react';
import {
    CardContent,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Box
} from '@mui/material';

const titleStyle = {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: 'rgb(100, 100, 100, 0.8)',
    marginBottom: '10px'
}

const TimelineTracker = ({ timeline }) => {
    return (
        <>
            <CardContent>

                <Typography sx={titleStyle}>Item Timeline</Typography>

                <Stepper
                    activeStep={timeline.length - 1}
                    orientation="horizontal"
                    alternativeLabel
                    sx={{
                        '& .MuiStepLabel-label.Mui-completed': {
                            backgroundColor: 'rgb(54, 114, 114, 0.4)',
                            color: 'black',
                            borderRadius: '10px',
                            padding: '10px',
                            textAlign: 'left'
                        },
                        '& .MuiStepLabel-label.Mui-active': {
                            backgroundColor: '#01AD7B',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '10px',
                            textAlign: 'left'
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
            </CardContent>
        </>
    );
};

export default TimelineTracker;