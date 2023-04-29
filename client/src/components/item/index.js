import React, { useState, useEffect } from 'react';
// import imageUnavailable from '../img/item-image-not-available.jpg';
import {
	Card,
	CardContent,
	Typography,
	CardHeader,
	Grid,
	Button,
	CardActions,
	Stepper,
	Step,
	StepLabel,
	CardMedia,
	Divider
} from '@mui/material';
import { Avatar } from '@mui/material';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LayoutProvider from "components/common/Layout";

const data = {
	id: 123,
	name: 'Mac Book Pro',
	description: 'This is a Mac Book Pro',
	type: 'Lost',
	status: 'Open',
	priority: 'High',
	tags: ['Electronics', 'Laptop', 'Hardware'],
	category: 'Electronics',
	reportedDate: '2023-10-10',
	reportedLocation: 'Babbio Center',
	reportedBy: 'John Doe',
	currentLocation: 'Babbio Center',
	claims: [],
	disputes: [],
	timelineDetails: [
		{
			id: 1,
			date: '2021-10-10',
			location: 'Babbio Center',
			description: 'Mac Book Pro was lost',
		},
		{
			id: 2,
			date: '2021-10-12',
			location: 'Babbio Center',
			description: 'Item reported to team member',
		}
	],
	comments: [
		{
			id: 1,
			date: '2021-10-10',
			location: 'Babbio Center',
			description: 'Mac Book Pro was lost',
		}
	],
	images: [
		"https://picsum.photos/seed/picsum/1000/1000",
		"https://picsum.photos/seed/picsum2/1000/1000",
		"https://picsum.photos/seed/picsum3/1000/1000",
		"https://picsum.photos/seed/picsum4/1000/1000",
		"https://picsum.photos/seed/picsum5/1000/1000",
		"https://picsum.photos/seed/picsum6/1000/1000",
		"https://picsum.photos/seed/picsum7/1000/1000",
		"https://picsum.photos/seed/picsum8/1000/1000",
		"https://picsum.photos/seed/picsum9/1000/1000"
	],
}

const titleStyle = {
	fontWeight: 'bold',
	fontSize: '1.5rem',
	color: 'rgb(200, 200, 200, 0.8)'
}

const contentStyle = {
	fontSize: '1.0rem',
	color: 'rgb(200, 200, 200, 0.5)'
}

const actionButtonStyle = {
	color: 'white',
	width: '100%',
	boxShadow: '0 0px 5px #000',
	backgroundColor: '#367272',
	'&:hover': {
		backgroundColor: 'rgb(200, 200, 200, 0.7)',
	},
}

function ItemDetails() {
	const [itemData, setItemData] = useState(undefined);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeStep, setActiveStep] = React.useState(0);

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleEdit = () => {
		//
	};

	const handleDelete = () => {
		//
	};

	const handleClaim = () => {
		//
	};


	useEffect(() => {
		async function fetchData() {
			try {
				setItemData(data);
				setLoading(false);
			} catch (e) {
				setLoading(false);
				setError('Unable to fetch item details');
				console.log(e);
			}
		}
		fetchData();
	}, []);

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else if (error) {
		return (
			<div>
				<h2>{error}</h2>
			</div>
		);
	} else {
		return (
			<LayoutProvider>
				{/* Top Actions -------------------------------------------------- START */}
				<CardActions
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						padding: '10px',
						marginBottom: '10px',
					}}
				>
					<Button onClick={() => { handleEdit() }} style={actionButtonStyle}> Edit </Button>
					<Button onClick={() => { handleDelete() }} style={actionButtonStyle}> Delete </Button>
					<Button onClick={() => { handleClaim() }} style={actionButtonStyle} > Claim</Button>
				</CardActions>
				{/* Top Actions -------------------------------------------------- END */}

				<Divider />

				{/* Card Header -------------------------------------------------- START */}
				<CardHeader
					avatar={
						<Avatar>
							{itemData.reportedBy[0]}
						</Avatar>
					}
					title={itemData.reportedBy}
					subheader={itemData.reportedDate}
					sx={{
						padding: '10px',
						marginBottom: '10px',
						color: 'rgb(200, 200, 200, 0.7)'
					}}
				/>
				{/* Card Header -------------------------------------------------- END */}

				<Divider />

				{/* Image Carousel -------------------------------------------------- START */}
				<CardContent
					sx={{
						justifyContent: 'center',
						marginTop: '10px',
						position: 'relative',
					}}
				>
					<CardMedia
						component='img'
						image={itemData.images[activeStep]}
						alt={itemData.images[activeStep]}
						style={{
							height: '400px',
							width: '100%',
							objectFit: 'cover',
							borderRadius: '10px',
							boxShadow: '0 0px 30px #000',
							position: 'relative',
							left: '50%',
							transform: 'translateX(-50%)',
						}}
					/>
					<MobileStepper
						steps={data.images.length}
						position="static"
						activeStep={activeStep}
						sx={{
							backgroundColor: 'rgba(0, 0, 0, 0.0)',
						}}
						nextButton={
							<Button
								size="small"
								onClick={handleNext}
								disabled={activeStep === data.images.length - 1}
							>
								Next<KeyboardArrowRight />
							</Button>
						}
						backButton={
							<Button
								size="small"
								onClick={handleBack}
								disabled={activeStep === 0}
							>
								<KeyboardArrowLeft />Back
							</Button>
						}
					/>
				</CardContent>
				{/* Image Container --------------------------------------------------- END */}

				<Divider />

				{/* Item Description -------------------------------------------------- START */}
				<CardContent
					sx={{
						padding: '10px',
						textAlign: 'left',
						margin: '10px',
					}}
				>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Typography sx={titleStyle} >Reported Date</Typography>
							<Typography sx={contentStyle}>{itemData.reportedDate}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography sx={titleStyle} >Reported Location</Typography>
							<Typography sx={contentStyle}>{itemData.reportedLocation}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography sx={titleStyle} >Reported By</Typography>
							<Typography sx={contentStyle}>{itemData.reportedBy}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography sx={titleStyle} >Current Location</Typography>
							<Typography sx={contentStyle}>{itemData.currentLocation}</Typography>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Typography sx={titleStyle} >Type</Typography>
							<Typography sx={contentStyle}>{itemData.type}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography sx={titleStyle} >Status</Typography>
							<Typography sx={contentStyle}>{itemData.status}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography sx={titleStyle} >Priority</Typography>
							<Typography sx={contentStyle}>{itemData.priority}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography sx={titleStyle} >Category</Typography>
							<Typography sx={contentStyle}>{itemData.category}</Typography>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography sx={titleStyle}>Description</Typography>
							<Typography sx={contentStyle}>{itemData.description}</Typography>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography sx={titleStyle} >Tags</Typography>
							<Typography sx={contentStyle}>{itemData.tags.join(', ')}</Typography>
						</Grid>
					</Grid>
				</CardContent>
				{/* Item Description -------------------------------------------------- END */}

				<Divider />

				{/* Progress Tracker -------------------------------------------------- START */}
				<CardContent sx={{ margin: '10px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography
								sx={titleStyle}>Progress Tracker</Typography>
						</Grid>
					</Grid>
					<Stepper activeStep={1} alternativeLabel>
						{itemData.timelineDetails.map((item) => (
							<Step key={item.id}>
								<StepLabel
								>{item.description}
								</StepLabel>
							</Step>
						))}
					</Stepper>
				</CardContent>
				{/* Progress Tracker -------------------------------------------------- END */}
			</LayoutProvider>
		);
	}
};

export default ItemDetails;
