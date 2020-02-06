import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./style.css";
import ThumbnailContainer from "../TumbnailContainer";

export default function imageModal(props) {
  console.log(props);

  let bodyContent = "";
  if (props.content === "my-images") {
    bodyContent = "My Images";
  } else if (props.content === "image-gallery") {
    bodyContent = "Image Gallery";
  } else if (props.content === "random") {
    bodyContent = "Random";
  }

  const URLs = props.attachments;
  const imageNames = props.images.map(image => image.content.name); 
  console.log("URLs" + URLs);

return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      bsSize="large"
      aria-labelledby="contained-modal-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-lg">Image Selector</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{bodyContent}</h4>
        <p>**Please note: you need to go to your profile to upload images to choose from.</p>
        <p> Click an image to set it as your background. </p>
        <ThumbnailContainer images={URLs} imageNames={imageNames} setBackground={props.setBackground} setBackgroundName={props.setBackgroundName} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}