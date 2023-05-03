import React, { useState, useEffect } from 'react';
// import imageUnavailable from '../img/item-image-not-available.jpg';
import {
	CardContent,
	Typography,
	CardHeader,
	Grid,
	Button,
	CardMedia,
	Divider,
	Avatar,
	TextField
} from '@mui/material';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LayoutProvider from "components/common/Layout";
import Comments from './Comments';
import TimelineTracker from './TimelineTracker';
import Actions from './ActionContainer';
import CustomSelect from './CustomSelect';
import ClaimsAndDisputes from './ClaimsAndDisputes';

import { foundData } from './testData';


function ItemDetails() {
	const [itemData, setItemData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [activeStep, setActiveStep] = React.useState(0);
	const handleNext = () => { setActiveStep((prevActiveStep) => prevActiveStep + 1); };
	const handleBack = () => { setActiveStep((prevActiveStep) => prevActiveStep - 1); };

	const itemTypeList = ['Lost', 'Found'];
	const itemStatusList = ['Open', 'Closed'];
	const itemCategoryList = ['Electronics', 'Clothing', 'Jewelry', 'Other'];

	useEffect(() => {
		async function fetchData() {
			try {
				setItemData(foundData);
				setLoading(false);
			} catch (e) {
				setLoading(false);
				setError('Unable to fetch item details');
			}
		}
		fetchData();
	}, [itemData]);

	const Text = ({ label, value }) => {
		return (
			<>
				<TextField
					label={label}
					defaultValue={value}
					InputProps={{
						readOnly: true,

					}}
					InputLabelProps={{
						style: {
							color: 'white',
							fontWeight: 'bold',
							fontSize: '1.3rem',
						}
					}}
					sx={{
						marginBottom: '20px',
						display: 'flex',
					}}
				/>
			</>
		);
	}


	if (loading) {
		return (
			<LayoutProvider>
				<h2> Loading.... </h2>
			</LayoutProvider>
		);
	} else if (error) {
		return (
			<LayoutProvider>
				<h2> Error loading item details: </h2>
				<h4> {error} </h4>
			</LayoutProvider>
		);
	} else {
		return (
			<LayoutProvider>

				{/* Action Container */}
				<Actions />

				<Divider />

				{/* Card Header - START */}
				<CardHeader
					avatar={
						<Avatar
							sx={{
								backgroundColor: 'rgb(54, 114, 114, 0.8)',
								color: 'white',
								fontWeight: 'bold',
								fontSize: '1.5rem',
							}}
						>
							{itemData.reportedBy[0]}
						</Avatar>
					}
					title={itemData.reportedBy}
					subheader={itemData.reportedDate}
				/>
				{/* Card Header - END */}

				<Divider />

				<Grid container spacing={1}
					sx={{
						backgroundColor: 'rgb(54, 114, 114, 0.8)',
						margin: '10px 10px',
						width: '100%',
						borderRadius: '10px',
						justifyContent: 'space-between',
					}}
				>
					{/* Image Carousel - START */}
					<Grid item xs={5.9}>
						<CardContent
							sx={{ marginTop: '10px', position: 'relative' }}
						>
							<CardMedia
								component='img'
								image={itemData.images[activeStep]}
								alt={itemData.images[activeStep]}
								style={{
									height: '380px',
									width: '100%',
									objectFit: 'cover',
									borderRadius: '10px',
									boxShadow: '0 0px 10px #000'
								}}
							/>
							<MobileStepper
								steps={itemData.images.length}
								position="static"
								activeStep={activeStep}
								sx={{
									backgroundColor: 'rgba(0, 0, 0, 0.0)',
									color: 'white',
									'& .MuiMobileStepper-dotActive': {
										backgroundColor: 'white',
									},
								}}
								nextButton={
									<Button
										onClick={handleNext}
										disabled={activeStep === itemData.images.length - 1}
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
							}} >Tags</Typography>
							{itemData.tags.map((tag) => (
								<Button
									key={tag}
									variant="contained"
									sx={{
										backgroundColor: '#01AD7B',
										color: 'white',
										borderRadius: '50px',
										marginRight: '10px',
										fontSize: '0.75rem',
									}}
								>
									{tag}
								</Button>
							))}
						</CardContent>
					</Grid>
					{/* Image Container - END */}

					<Grid item xs={0.2}
						sx={{
							display: 'flex',
							justifyContent: 'center',
							marginBottom: '10px',
						}}>
						<Divider
							orientation="vertical"
							sx={{ backgroundColor: 'white', width: '1px' }}
						/>
					</Grid>

					{/* Item Description - START */}
					<Grid item xs={5.9}>
						<CardContent sx={{ padding: '10px', textAlign: 'left', margin: '10px' }}>

							{/* Item Name */}
							<Text
								label="Item Name"
								value={itemData.name}
							/>

							{/* Item Description */}
							<Text
								label="Description"
								value={itemData.description}
							/>

							{/* Item Reporter */}
							<Text
								label="Reported By"
								value={itemData.reportedBy}
							/>

							{/* Item Description */}
							<Text
								label="Reported On"
								value={itemData.reportedDate}
							/>

							{/* Item Location */}
							{itemData.type === 'Lost' && itemData.reportedLocation && (
								<Text
									label="Reported Location of the Item"
									value={itemData.reportedLocation}
								/>
							)}
							{itemData.type === 'Found' && itemData.reportedLocation && (
								<Text
									label="Current Location of the Item"
									value={itemData.currentLocation}
								/>
							)}

							<Divider sx={{ marginBottom: '20px' }} />

							<Grid container spacing={2}
								orientation="column"
							>
								<Grid item xs={2}>
									{/* Item Status */}
									<CustomSelect
										id="item-status"
										label="Item Status"
										value={itemData.status}
										disabled={true}
										itemList={itemStatusList}
									/>
								</Grid>
								<Grid item xs={2}>
									{/* Item Type */}
									<CustomSelect
										id="item-type"
										label="Item Type"
										value={itemData.type}
										disabled={true}
										itemList={itemTypeList}
									/>
								</Grid>
								<Grid item xs={8}>
									{/* Item Category */}
									<CustomSelect
										id="item-category"
										label="Item Category"
										value={itemData.category}
										disabled={true}
										itemList={itemCategoryList}
									/>
								</Grid>
							</Grid>
						</CardContent>
					</Grid>
					{/* Item Description - END */}

				</Grid>

				<Divider />

				{/* TimelineTracker */}
				<TimelineTracker
					timeline={itemData.timelineDetails}
				/>

				<Divider />

				{/* Claims and disputed Tabs */}
				<ClaimsAndDisputes
					claims={itemData.claims}
					disputes={itemData.disputes}
				/>

				<Divider />

				{/* Comments Section */}
				<Comments
					comments={itemData.comments}
				/>

			</LayoutProvider>
		);
	}
};

export default ItemDetails;
