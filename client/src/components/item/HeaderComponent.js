import React, { useState } from 'react';
import {
    CardActions,
    CardHeader,
    Avatar,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

const buttonStyle = {
    height: '45px',
    width: '45px',
    borderRadius: '50%',
    backgroundColor: '#1c2536',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#ff9717',
    },
};

const dialogButtonStyle = {
    color: '#fff',
    border: '2px solid #ff9717',
    width: '150px',
    '&:hover': {
        backgroundColor: '#ff9717',
    },
}

const avatarStyle = {
    height: '60px',
    width: '60px',
    backgroundColor: '#1c2536',
    color: '#ff9717',
    fontWeight: 'bold',
    fontSize: '2.5rem'
};

const DialogComponent = ({ open, handleClose, handleAction, title, actionText }) => {
    return (
        <div>
            <Dialog open={open} onClose={handleClose}
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: '#4A5569',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '5px',
                        maxWidth: '600px'
                    }
                }}
            >
                <DialogTitle>{title}</DialogTitle>
                <Divider
                    sx={{
                        backgroundColor: '#ff9717',
                        marginBottom: '10px',
                    }}
                />
                <DialogContent>
                    <DialogContentText
                        sx={{
                            fontSize: '1.2rem',
                            color: '#e6e6e6'
                        }}
                    >
                        {actionText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleAction}
                        startIcon={<ThumbUpOffAltIcon />}
                        sx={dialogButtonStyle}
                    >
                        Confirm
                    </Button>
                    <Button
                        onClick={handleClose}
                        startIcon={<CancelIcon />}
                        sx={dialogButtonStyle}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


const Header = ({ itemData }) => {
    const [openClaim, setOpenClaim] = useState(false);
    const [openDispute, setOpenDispute] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleEdit = () => {
        //
    };

    const handleDeleteOpen = () => {
        setOpenDelete(true);
        
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
    }

    const handleClaimOpen = () => {
        setOpenClaim(true);
    };

    const handleClaimClose = () => {
        setOpenClaim(false);
    };

    const handleDisputeOpen = () => {
        setOpenDispute(true);
    };

    const handleDisputeClose = () => {
        setOpenDispute(false);
    };

    const handleDeleteAction = () => {
        setOpenDelete(false);
    };

    const handleClaimAction = () => {
        setOpenClaim(false);
    };

    const handleDisputeAction = () => {
        setOpenDispute(false);
    };

    return (
        <>
            <CardHeader
                avatar={
                    <Avatar sx={avatarStyle} >
                        {itemData.reportedBy[0]}
                    </Avatar>
                }
                title={itemData.reportedBy}
                subheader={itemData.reportedDate}
                action={
                    <CardActions>
                        <Tooltip
                            title="Edit this item"
                            placement="bottom"
                            arrow
                        >
                            <IconButton
                                aria-label="edit"
                                onClick={handleEdit}
                                sx={buttonStyle}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip
                            title="Delete this item"
                            placement="bottom"
                            arrow
                        >
                            <IconButton
                                aria-label="delete"
                                onClick={handleDeleteOpen}
                                sx={buttonStyle}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip
                            title="Claim this item"
                            placement="bottom"
                            arrow
                        >
                            <IconButton
                                aria-label="claim"
                                onClick={handleClaimOpen}
                                sx={buttonStyle}
                            >
                                <CheckIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip
                            title="Raise dispute"
                            placement="bottom"
                            arrow
                        >
                            <IconButton
                                aria-label="Dispute"
                                onClick={handleDisputeOpen}
                                sx={buttonStyle}
                            >
                                <ErrorOutlineIcon />
                            </IconButton>
                        </Tooltip>

                    </CardActions>
                }
            />

            <DialogComponent
                open={openDelete}
                handleClose={handleDeleteClose}
                handleAction={handleDeleteAction}
                title="Delete Item"
                actionText="Are you sure you want to delete this item?"
            />

            <DialogComponent
                open={openClaim}
                handleClose={handleClaimClose}
                handleAction={handleClaimAction}
                title="Claim Item"
                actionText="Are you sure you want to claim this item?"
            />

            <DialogComponent
                open={openDispute}
                handleClose={handleDisputeClose}
                handleAction={handleDisputeAction}
                title="Raise Dispute"
                actionText="Are you sure you want to raise a dispute for this item?"
            />
        </>
    );
};

export default Header;