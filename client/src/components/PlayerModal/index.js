import React, { useState } from "react";
import { Modal, Button, Well } from "react-bootstrap";
import "./style.css";

export default function PlayerModal(props) {
//   console.log(props);
  const [selected, setSelected] = useState(false);

  function toggleClass() {
    setSelected(!selected);
  }

  if(props.modalName === "Sorry, no user found with the requested name.") {
      return (
        <Modal
        show={props.show}
        onHide={props.onHide}
        bsSize="large"
        aria-labelledby="contained-modal-title-lg"
        >
            <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Start a Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <h1>Sorry, no user found with the requested name.</h1>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
        )
  }

return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      bsSize="large"
      aria-labelledby="contained-modal-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-lg">Start a Game</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>Select the user you want to send your game to.</h1>
        <Well 
        className={selected ? "border" : "noBorder"}
        onClick={() => toggleClass()}
        >{props.modalName}</Well>
        <Button 
        disabled={!selected}
        onClick={() => props.startGame()}>Start a game</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}