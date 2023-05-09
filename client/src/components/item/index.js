import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
	Grid,
	Box,
	Divider,
	Input,
	Typography,
	CardMedia,
	Chip,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Button,
	IconButton,
	Modal
} from "@mui/material";

import {
	confirmClaimRequest,
	declineClaimRequest,
	getItemDetailsById,
	editItemById,
	editItemImage
} from "utils/apis/item";

import {
	PhotoCamera,
	SaveAlt,
} from "@mui/icons-material";

import LayoutProvider from "components/common/Layout";
import LoadingText from "components/common/loadingText";
import Comments from "./Comments";
import ErrorPage from "./ErrorPage";
import Header from "./HeaderComponent";
import TimelineTracker from "./TimelineTracker";
import ClaimsAndDisputes from "./ClaimsAndDisputes";
import Loading from "components/common/BtnLoading";

import { categoryOptions } from "utils/constants";


const titleStyle = {
	fontWeight: "bold",
	fontSize: "1.5rem",
	color: "#324b4b",
	marginBottom: "10px"
};

function ItemDetails() {
	const userData = useSelector((state) => state?.userData?.userData);
	const params = useParams();
	const [itemData, setItemData] = useState({});
	const [updatedItemData, setUpdatedItemData] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [editable, setEditable] = useState(false);
	const [statusCode, setStatusCode] = useState(200);
	const [claimRequestModalData, setClaimRequestModalData] = useState({});
	const [respondClaimRequestModal, setRespondClaimRequestModal] = useState(false);

	// Image Vars
	const handleModalView = () => setModalView(true);
	const editorRef = useRef(null);
	const [imageObj, setImageObj] = useState(null);
	const [modalView, setModalView] = useState(false);
	const handleClose = () => setModalView(false);
	const [imageUploadLoading, setImageUploadLoading] = React.useState(false);

	useEffect(() => {
		setLoading(true);
		getItemDetailsById(params.id).then((res) => {
			const { status, data } = res;
			if (status !== 200) {
				if (status === 404) {
					setError("Item not found!");
				} else if (status === 401) {
					setError("You are not authorized to view this item!");
				} else if (status === 400) {
					setError("Item id is invalid! Please check the url.");
				} else {
					setError("Something went wrong! Please try again later or contact support.");
				}
				setStatusCode(status);

			} else setItemData(data?.data);
			setLoading(false);
		});
	}, [params.id]);

	const handleCategoryChange = (e) => {
		setItemData((prev) => ({
			...prev,
			'category': e.target.value,
		}));

		setUpdatedItemData((prev) => ({
			...prev,
			'category': e.target.value,
		}));
	};

	const handleDataEdit = async () => {
		if (editable) {
			const { status, data } = await editItemById(itemData._id, updatedItemData);
			if (status === 200) {
				setItemData(data?.updatedItem);
				setEditable(false);
			}
		} else {
			setEditable(true);
		}
	};

	const uploadImage = async () => {
		setImageUploadLoading(true);
		let formData = new FormData();
		formData.append("imageUrl", imageObj);
		const { data } = await editItemImage(itemData._id, formData);
		setItemData(data?.updatedItem);
		setImageUploadLoading(false);
		setImageObj(null);
		handleClose();
	};

	const UploadPictureModal = () => {
		return (
			<Modal
				open={modalView}
				onClose={() => {
					setImageObj(null);
					handleClose();
				}}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<div className="profile_upload_modal">
					<img
						className="user_profile_picture"
						src={imageObj ? URL.createObjectURL(imageObj) : itemData?.imageUrl}
						ref={editorRef}
						width={"250px"}
						height={"280px"}
						alt="preview"
					/>
					<div>
						{imageObj ? (
							<div className="flex mt-4">
								<button className="btn_default mr-2" onClick={uploadImage}>
									<Loading loading={imageUploadLoading} width={18} />
									Upload
								</button>
								<button
									className="btn_default__cancel"
									onClick={() => {
										setImageObj(null);
										handleClose();
									}}
								>
									Cancel
								</button>
							</div>
						) : (
							<IconButton
								color="primary"
								aria-label="upload picture"
								component="label"
								disableRipple={true}
							>
								<input
									hidden
									accept=".png, .jpg, .jpeg"
									type="file"
									onChange={(e) => {
										e.preventDefault();
										if (e.target.files[0]?.size / (1024 * 1024) > 5)
											return toast.error("File size more than 5MB");
										setImageObj(e.target.files[0]);
									}}
								/>
								<PhotoCamera />
								upload image
							</IconButton>
						)}
					</div>
				</div>
			</Modal>
		);
	};

	const CustomSelect = ({ label, value, disabled }) => {
		return (
			<>
				<FormControl
					sx={{
						display: 'flex',
						width: "100%",
						marginBottom: "20px",
					}}
				>
					<InputLabel
						id={`${params.id}-label`}
						sx={{
							color: "white",
							fontWeight: "bold",
							fontSize: "1.3rem",
						}}
					>
						{label}
					</InputLabel>
					<Select
						labelId={`${params.id}-label`}
						value={value?.toLowerCase()}
						label={label}
						disabled={disabled}
						onChange={handleCategoryChange}
						sx={{
							fontWeight: "bold",
							fontSize: "1.2rem",
						}}
					>
						{categoryOptions.map((item) => (
							<MenuItem key={item} value={item.toLowerCase()}>
								{item}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</>
		);
	};

	const handleRequestModal = (type, item) => {
		if (type === "claim") {
			setClaimRequestModalData(item);
			setRespondClaimRequestModal(true);
		}
	};

	if (loading) {
		return (
			<LayoutProvider>
				<LoadingText />
			</LayoutProvider>
		);
	}
	else if (error) {
		return (
			<ErrorPage
				code={statusCode}
				message={error}
			/>
		);
	} else {
		return (
			<LayoutProvider>
				<Header
					itemData={itemData}
					editable={editable}
					setEditable={setEditable}
				/>

				<Divider
					sx={{
						backgroundColor: "#ff9717",
						marginBottom: "10px",
					}}
				/>

				<Grid
					container
					sx={{
						display: { xs: "block", sm: "block", md: "flex" },
						backgroundColor: "#2E3643",
						width: "100%",
						borderRadius: "10px",
						justifyContent: "space-between",
						padding: "0",
						margin: "0",
					}}
				>
					{/* Image */}
					<Grid item xs={12} sm={12} md={6} lg={6} xl={3.5}
						sx={{
							padding: "20px",
							display: "flex",
							alignContent: "space-between",
						}}
					>
						<Grid container xs={12}
							sx={{
								display: "flex",
								alignContent: "space-between",
							}}
						>
							<Grid item xs={12}>
								<CardMedia
									component="img"
									src={itemData?.imageUrl}
									alt={itemData?.itemName}
									sx={{
										width: "fit-content",
										objectFit: "contain",
										borderRadius: "10px",
										boxShadow: "0 0px 10px #000",
									}}
								/>
							</Grid>

							{/* Edit Image Button */}
							<Grid item xs={12}>
								{editable && (
									<Button
										startIcon={<PhotoCamera />}
										variant="contained"
										sx={{
											backgroundColor: "#ff9717",
											color: "#1c2536",
											fontSize: "1.2rem",
											width: "100%",
											marginTop: "10px",
										}}
										component="label"
										onChange={handleModalView}
									>
										Edit Image
									</Button>
								)}
							</Grid>
						</Grid>
						{UploadPictureModal()}
					</Grid>

					{/* Item Description - START */}
					<Grid item xs={12} sm={12} md={6} lg={6} xl={8.5}>
						<Box sx={{
							padding: "5px",
							display: "flex",
							flexDirection: "column",
							alignItems: "left",
							justifyContent: "center",
							margin: "7px",
						}}>
							{/* Item Name */}
							<InputLabel
								id={`${params.id}-label-itemName`}
								sx={{
									color: "white",
									fontWeight: "bold",
									fontSize: "1.3rem",
								}}
							>
								Item Name
							</InputLabel>
							<Input
								label="Item Name"
								defaultValue={itemData?.itemName}
								disabled={!editable}
								onChange={(e) =>
									setUpdatedItemData((prev) => ({
										...prev,
										'itemName': e.target.value,
									}))
								}
								sx={{
									fontWeight: "bold",
									fontSize: "1.2rem",
									marginBottom: "20px",
								}}
							/>

							{/* Item Description */}
							<InputLabel
								id={`${params.id}-label-itemDescription`}
								sx={{
									color: "white",
									fontWeight: "bold",
									fontSize: "1.3rem",
								}}
							>
								Item Description
							</InputLabel>
							<Input
								label="Item Description"
								defaultValue={itemData?.description}
								disabled={!editable}
								onChange={(e) =>
									setUpdatedItemData((prev) => ({
										...prev,
										'description': e.target.value,
									}))
								}
								sx={{
									fontWeight: "bold",
									fontSize: "1.2rem",
									marginBottom: "20px",
								}}
							/>

							{/* Item Location */}
							<InputLabel
								id={`${params.id}-label-itemLocation`}
								sx={{
									color: "white",
									fontWeight: "bold",
									fontSize: "1.3rem",
								}}
							>
								{itemData?.type === "lost" ? "Lost Location" : "Found Location"}
							</InputLabel>
							<Input
								label="Item Location"
								defaultValue={itemData?.lastSeenLocation}
								disabled={!editable}
								onChange={(e) =>
									setUpdatedItemData((prev) => ({
										...prev,
										'lastSeenLocation': e.target.value,
									}))
								}
								sx={{
									fontWeight: "bold",
									fontSize: "1.2rem",
									marginBottom: "20px",
								}}
							/>

							{/* Item Type */}
							<InputLabel
								id={`${params.id}-label-itemType`}
								sx={{
									color: "white",
									fontWeight: "bold",
									fontSize: "1.3rem",
								}}
							>
								Type
							</InputLabel>
							<Input
								label="Item Type"
								defaultValue={itemData?.type}
								disabled={!editable}
								onChange={(e) =>
									setUpdatedItemData((prev) => ({
										...prev,
										'itemType': e.target.value,
									}))
								}
								sx={{
									fontWeight: "bold",
									fontSize: "1.2rem",
									marginBottom: "20px",
								}}
							/>

							{/* Item Status */}
							<InputLabel
								id={`${params.id}-label-itemStatus`}
								sx={{
									color: "white",
									fontWeight: "bold",
									fontSize: "1.3rem",
								}}
							>
								Status
							</InputLabel>
							<Input
								label="Item Status"
								defaultValue={itemData?.itemStatus}
								disabled={!editable}
								onChange={(e) =>
									setUpdatedItemData((prev) => ({
										...prev,
										'itemStatus': e.target.value,
									}))
								}
								sx={{
									fontWeight: "bold",
									fontSize: "1.2rem",
									marginBottom: "20px",
								}}
							/>

							{/* Item Category */}
							<CustomSelect
								label="Category"
								value={itemData?.category}
								disabled={!editable}
							/>

							{editable && (
								<Button
									startIcon={<SaveAlt />}
									variant="contained"
									sx={{
										backgroundColor: "#ff9717",
										color: "#1c2536",
										fontSize: "1.2rem",
										width: "100%",
										marginBottom: "10px",
									}}
									onClick={handleDataEdit}
								>
									Update
								</Button>
							)}
						</Box>
					</Grid>
				</Grid>

				<Divider sx={{ backgroundColor: "#ff9717", margin: "10px 0px" }} />

				{/* Item Tags */}
				<Grid container xs={12}
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "left",
					}}>
					<Grid item xs={12}>
						<Typography sx={titleStyle}>Tags</Typography>
					</Grid>
					<Grid item xs={12}
						sx={{
							backgroundColor: "#2E3643",
							borderRadius: "10px",
							padding: "10px",
						}}
					>
						{itemData?.tags?.split(",")?.map((tag) => (
							<Chip
								key={tag}
								sx={{
									backgroundColor: "#ff9717",
									color: "#1c2536",
									borderRadius: "50px",
									marginRight: "5px",
									fontSize: "1rem",
									fontWeight: "bold",
									marginBottom: "5px",
								}}
								label={tag}
							/>
						))}
					</Grid>
				</Grid>

				<Divider sx={{ backgroundColor: "#ff9717", margin: "10px 0px" }} />

				{/* Timeline Tracker */}
				<TimelineTracker timeline={itemData?.timelineDetails} />

				<Divider sx={{ backgroundColor: "#ff9717", margin: "10px 0px" }} />

				{/* Claims and disputed Tabs */}
				<Grid
					container
					xs={12}
					sx={{
						display: { xs: "block", sm: "flex" },
						backgroundColor: "#4A5569",
						width: "100%",
						borderRadius: "10px",
						justifyContent: "space-between"
					}}
				>
					<Grid xs={12}>
						<ClaimsAndDisputes
							claims={itemData?.claims}
							disputes={itemData?.disputes}
							itemStatus={itemData?.itemStatus}
							handleRequestModal={handleRequestModal}
							showModalBtn={itemData?.uid === userData?.user_firebase_id}
						/>
					</Grid>
				</Grid>

				<Divider sx={{ backgroundColor: "#ff9717", marginTop: "20px" }} />

				{/* Comments Section */}
				<Comments
					comments={itemData?.comments}
					setItemData={setItemData}
					postId={itemData?._id}
					userId={userData?.user_firebase_id}

				/>
			</LayoutProvider>
		);
	}
}

export default ItemDetails;

{/*
<ActionDialog
	open={respondClaimRequestModal}
	handleClose={() => setRespondClaimRequestModal(false)}
	handleAction={async (e) => {
	if (e === "accept") {
		const { data } = await comfirmClaimRequest(
		itemData._id,
		claimRequestModalData?.userId
		);
		setItemData(data?.updatedItem);
		setRespondClaimRequestModal(false);
	} else if (e === "decline") {
		const { data } = await declineClaimRequest(
		itemData._id,
		claimRequestModalData?.userId
		);
		setItemData(data?.updatedItem);
		setRespondClaimRequestModal(false);
	}
	}}
	buttonCount={3}
	title="Respond to claim request"
	actionText="Respond to the claim request for this item?"
/> */}