import React from "react";
import { IconButton, Modal, Slider } from "@mui/material";
import { AuthContext } from "FirebaseUtils/authenticate";
import LayoutProvider from "components/common/Layout";
import { PhotoCamera } from "@mui/icons-material";
// import Loading from "components/common/Loading";
import {
  capitalizeFirstLetter,
  fullNameFormatter,
  phoneNumberFormatter,
} from "utils/helper";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
// import CloseIcon from "@mui/icons-material/Close";
import AvatarEditor from "react-avatar-editor";
import DefaultProfile from "../../utils/images/default_profile_pic.png";

import "./styles.css";

function Profile() {
  const [currentUser] = React.useContext(AuthContext);
  console.log({ currentUser });
  const data = currentUser?.userData;
  const editorRef = React.useRef(null);
  const [modalView, setModalView] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [borderRadius, setBorderRadius] = React.useState(1);
  const [editView, setEditView] = React.useState(false);
  // const [errors, setErrors] = React.useState(false);
  // const [userData, setUserData] = React.useState(null);
  // const [updateUserData, setUpdateUserData] = React.useState(null);
  // const [updateLoading, setUpdateLoading] = React.useState(false);
  const [imageObj, setImageObj] = React.useState(null);

  const handlemodalView = () => setModalView(true);
  const handleClose = () => setModalView(false);

  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    profile_photo_url = "",
  } = data;
  return (
    <LayoutProvider>
      <div className="md:flex md:flex-col md:items-center grid grid_spaces text-[#1d1f23] mb-4">
        <div className="user_profile_picture relative">
          <img
            src={
              profile_photo_url !== ""
                ? process.env.REACT_APP_BASE_URL +
                  "/images/" +
                  profile_photo_url
                : DefaultProfile
            }
            alt="your profile"
          />
          <div
            className="w-fit absolute bottom-0 right-0 scale-90 hover:scale-100"
            onClick={handlemodalView}
          >
            <IconButton aria-label="upload picture" component="label">
              <PhotoCamera color="#393e46" />
            </IconButton>
          </div>
        </div>

        <div className="py-4 px-3 text-xl">
          <div className="flex items-center text-3xl  font-bold h-[40px]">
            <span className="fullname ">
              {fullNameFormatter(firstName, lastName)}
            </span>
            <div
              onClick={() => {
                // setUpdateUserData(userData);
                setEditView(!editView);
              }}
              className="btn_edit_profile"
            >
              Edit profile
            </div>
          </div>
          <div className="flex">
            <div className="flex items-center">
              <div className="w-[30px] h-[30px]">
                <CakeOutlinedIcon color="#1d1f23" />
              </div>
              <span>{dob}</span>
            </div>
            <div className="pl-4">{capitalizeFirstLetter(gender)}</div>
          </div>
          <div className="flex items-center">
            <div className="w-[30px] h-[30px]">
              <MailOutlineIcon color="#1d1f23" />
            </div>
            <span>{email}</span>
            <div className="pl-4 w-[30px] h-[30px]">
              <PhoneAndroidOutlinedIcon color="#1d1f23" />
            </div>{" "}
            <span className="pl-2">{phoneNumberFormatter(phone)}</span>
          </div>
        </div>
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
            <div className="user_profile_picture">
              <AvatarEditor
                ref={editorRef}
                image={
                  imageObj ? URL.createObjectURL(imageObj) : DefaultProfile
                }
                width={280}
                height={280}
                border={1}
                color={[57, 62, 70]} // RGBA
                scale={zoom}
                rotate={0}
                borderRadius={borderRadius}
              />
              {imageObj && (
                <div>
                  <div className="flex align-middle mt-2">
                    <span className="text-xl mr-2">Zoom</span>
                    <Slider
                      min={0}
                      max={2}
                      step={0.1}
                      size="small"
                      defaultValue={1}
                      onChange={(e) => setZoom(e.target.value)}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      track={false}
                    />
                  </div>
                  <div className="flex align-middle mt-2">
                    <span className="text-xl mr-2">Border radius</span>
                    <Slider
                      min={10}
                      max={150}
                      step={5}
                      size="small"
                      defaultValue={10}
                      onChange={(e) => setBorderRadius(e.target.value)}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      track={false}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              {imageObj ? (
                <div className="flex mt-4">
                  <button
                    className="btn_default mr-2"
                    onClick={() => {}}
                    // {uploadImage}
                  >
                    {/* <Loading loading={updateLoading} width={18} /> */}
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
      </div>
    </LayoutProvider>
  );
}

export default Profile;
