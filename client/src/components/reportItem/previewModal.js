import { Chip, Modal } from "@mui/material";
import React from "react";
import "./styles.css";

function PreviewModal({ open, onClose, data }) {
  const {
    itemName,
    type,
    description,
    category,
    tags,
    image,
    lastSeenLocation,
    dateTime,
  } = data;
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal w-[650px] sm:w-[90%] sm:max-h-[80%]">
          <div className="modal_header">Review information</div>
          <div className="modal_body">
            <div className="modal_body__key">Type:</div>
            <div className="modal_body__value">{type}</div>
            <div className="modal_body__key">Name: </div>
            <div className="modal_body__value">{itemName}</div>
            <div className="modal_body__key">Description</div>
            <div className="modal_body__value">{description}</div>
            <div className="modal_body__key">Category:</div>
            <div className="modal_body__value">{category}</div>
            <div className="modal_body__key">Tags:</div>
            <div className="modal_body__value">
              {tags?.split(",").map((tag) => (
                <Chip label={tag} />
              ))}
            </div>
            <div className="modal_body__key">Image:</div>
            <div>
              <img
                src={
                  image ??
                  "https://plainenglish.io/assets/post-content/javascript-operator.jpg"
                }
                width={200}
                alt={itemName}
              />
            </div>
            <div className="modal_body__key">Last Seen Location:</div>
            <div className="modal_body__value">{lastSeenLocation}</div>
            <div className="modal_body__key">Lost Date & Time</div>
            <div className="modal_body__value">{dateTime}</div>
          </div>
          <div className="modal_footer">
            <button
              className="btn_default"
              // onClick={validateData}
              // disabled={loading}
            >
              Confirm
            </button>
            <button
              className="btn_default__light"
              onClick={onClose}
              // disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PreviewModal;
