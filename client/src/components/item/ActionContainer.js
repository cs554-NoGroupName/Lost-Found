import React from 'react';
import {
    CardActions,
    Button,
    Box,
    Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

const buttonStyle = {
    height: '80px',
    width: '80px',
    position: 'absolute',
    top: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '50%',
    backgroundColor: 'rgb(54, 114, 114)',
    border: '3px solid #fff',
    color: '#fff',
    fontSize: '24px',
    '&:hover': {
        backgroundColor: '#01AD7B',
    },
    '.MuiButton-startIcon': {
        margin: '0',
        padding: '0',
        fontSize: '40px',
    }
};

const typoStyle = {
    flexGrow: '1',
    color: '#fff',
    textAlign: 'center',
    fontSize: '18px',
    marginTop: '45px',
}

const boxStyle = {
    position: 'relative',
    backgroundColor: 'rgb(54, 114, 114)',
    borderRadius: '10px',
    height: '80px',
    width: '100%',
    margin: '50px 0 0 0',
};


const Actions = () => {
    const handleEdit = () => {
        //
    };

    const handleDelete = () => {
        //
    };

    const handleClaim = () => {
        //
    };

    return (
        <>
            <CardActions
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    marginBottom: '10px',
                }}
            >
                <Box sx={boxStyle}>
                    <Button
                        onClick={() => { handleEdit() }}
                        sx={buttonStyle}
                        startIcon={<EditIcon />}
                    />
                    <Typography variant="h6" component="div" sx={typoStyle}>
                        Edit the current Item
                    </Typography>
                </Box>

                <Box sx={boxStyle}>
                    <Button
                        onClick={() => { handleDelete() }}
                        sx={buttonStyle}
                        startIcon={<DeleteIcon />}
                    />
                    <Typography variant="h6" component="div" sx={typoStyle}>
                        Delete the current Item
                    </Typography>
                </Box>

                <Box sx={boxStyle}>
                    <Button
                        onClick={() => { handleClaim() }}
                        sx={buttonStyle}
                        startIcon={<CheckIcon />}
                    />
                    <Typography variant="h6" component="div" sx={typoStyle}>
                        Claim the current Item
                    </Typography>
                </Box>

            </CardActions>
        </>
    );
};

export default Actions;