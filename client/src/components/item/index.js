import React, { useState, useEffect } from 'react';
import {
	Grid,
	Box,
	Divider,
	TextField
} from '@mui/material';

import LayoutProvider from "components/common/Layout";
import Comments from './Comments';
import TimelineTracker from './TimelineTracker';
import Header from './HeaderComponent';
import CustomSelect from './CustomSelect';
import ClaimsAndDisputes from './ClaimsAndDisputes';
import LoadingText from "components/common/loadingText";
import ImageAndTags from './ImageAndTags';

import { foundData } from './testData';


function ItemDetails() {
	const [itemData, setItemData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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
					fullWidth
					disabled={true}
					sx={{
						marginBottom: '20px',
						display: { xs: 'none', sm: 'block' },
						justifyContent: 'space-between',
						'& .MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled': {
							'-webkit-text-fill-color': '#e6e6e6',
						},
					}}
					InputProps={{
						sx: {
							color: '#e6e6e6',
							fontSize: '1rem'
						}
					}}
					InputLabelProps={{
						style: {
							color: '#fff',
							fontWeight: 'bold',
							fontSize: '1.3rem'
						}
					}}
				/>
			</>
		);
	}


	if (loading) {
		return (
			<LayoutProvider>
				<LoadingText />
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

				<Divider sx={{ backgroundColor: '#ff9717' }} />

				{/* Header Container */}
				<Header itemData={itemData} />

				<Divider
					sx={{
						backgroundColor: '#ff9717',
						marginBottom: '10px',
					}}
				/>

				<Grid container
					sx={{
						display: { xs: 'block', sm: 'flex' },
						backgroundColor: '#4A5569',
						width: '100%',
						borderRadius: '10px',
						justifyContent: 'space-between',
						padding: '0',
						margin: '0'
					}}
				>
					{/* Image Carousel */}
					<ImageAndTags
						images={itemData.images}
						tags={itemData.tags}
					/>

					<Grid item xs={0.2}
						sx={{
							display: 'flex',
							justifyContent: 'center',
							marginBottom: '10px',
						}}>
						<Divider
							orientation="vertical"
							sx={{ backgroundColor: '#ff9717', width: '1px' }}
						/>
					</Grid>

					{/* Item Description - START */}
					<Grid item xs={5.9}>
						<Box sx={{ padding: '10px', textAlign: 'left', margin: '10px' }}>

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

							<CustomSelect
								id="item-category"
								label="Item Category"
								value={itemData.category}
								disabled={true}
								itemList={itemCategoryList}
							/>

							<Grid container orientation="column">
								<Grid item xs={12}>
									{/* Item Category */}
								</Grid>
								<Grid item xs={5.5}>
									{/* Item Status */}
									<CustomSelect
										id="item-status"
										label="Item Status"
										value={itemData.status}
										disabled={true}
										itemList={itemStatusList}
									/>
								</Grid>
								<Grid item xs={1}>
									{/* Item Type */}
								</Grid>
								<Grid item xs={5.5}>
									{/* Item Type */}
									<CustomSelect
										id="item-type"
										label="Item Type"
										value={itemData.type}
										disabled={true}
										itemList={itemTypeList}
									/>
								</Grid>

							</Grid>
						</Box>
					</Grid>
					{/* Item Description - END */}

				</Grid>

				<Divider sx={{ backgroundColor: '#ff9717', marginTop: '20px' }} />

				{/* TimelineTracker */}
				<TimelineTracker
					timeline={itemData.timelineDetails}
				/>

				<Divider sx={{ backgroundColor: '#ff9717', marginBottom: '20px' }} />

				<Grid container
					sx={{
						display: { xs: 'block', sm: 'flex' },
						backgroundColor: '#4A5569',
						width: '100%',
						borderRadius: '10px',
						justifyContent: 'space-between',
					}}
				>
					<Grid item xs={12}>
						<ClaimsAndDisputes
							claims={itemData.claims}
							disputes={itemData.disputes}
						/>
					</Grid>
				</Grid>
				{/* Claims and disputed Tabs */}


				<Divider sx={{ backgroundColor: '#ff9717', marginTop: '20px' }} />

				{/* Comments Section */}
				<Comments
					comments={itemData.comments}
				/>

			</LayoutProvider>
		);
	}
};

export default ItemDetails;