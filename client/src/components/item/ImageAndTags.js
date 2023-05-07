import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    CardMedia,
    MobileStepper
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';


const ImageAndTags = ({ images, tags }) => {
    const [activeStep, setActiveStep] = useState(0);
    const handleNext = () => { setActiveStep((prevActiveStep) => prevActiveStep + 1); };
    const handleBack = () => { setActiveStep((prevActiveStep) => prevActiveStep - 1); };

    return (
        <>
            <Grid item xs={5.9}>
                <Box
                    sx={{
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <CardMedia
                        component='img'
                        image={images[activeStep]}
                        alt={images[activeStep]}
                        sx={{
                            height: '380px',
                            width: '100%',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            boxShadow: '0 0px 10px #000'
                        }}
                    />
                    <MobileStepper
                        steps={images.length}
                        position="static"
                        activeStep={activeStep}
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.0)',
                            color: 'white',
                            '& .MuiMobileStepper-dotActive': {
                                backgroundColor: '#ff9717',
                            },
                        }}
                        nextButton={
                            <Button
                                onClick={handleNext}
                                disabled={activeStep === images.length - 1}
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        color: 'black',
                                    },
                                }}
                            >
                                Next<KeyboardArrowRight />
                            </Button>
                        }
                        backButton={
                            <Button
                                onClick={handleBack}
                                disabled={activeStep === 0}
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        color: 'black',
                                    },
                                }}
                            >
                                <KeyboardArrowLeft />Back
                            </Button>
                        }
                    />
                    <Typography sx={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'rgb(200, 200, 200, 0.8)',
                        marginBottom: '10px'
                    }}
                    >
                        Tags
                    </Typography>

                    <Box sx={{
                        display: 'flex',

                        flexWrap: 'wrap',
                        marginBottom: '20px'
                    }}>
                        {tags.map((tag) => (
                            <Button
                                key={tag}
                                variant="contained"
                                sx={{
                                    backgroundColor: '#ff9717',
                                    color: 'black',
                                    borderRadius: '50px',
                                    marginRight: '10px',
                                    fontSize: '0.75rem',
                                }}
                            >
                                {tag}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Grid>
        </>
    );
};

export default ImageAndTags;