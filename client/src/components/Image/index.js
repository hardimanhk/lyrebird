import React from "react";
import { Panel, Button } from "react-bootstrap";
import "./style.css";

export default function Image(props) {
    let imageIsChosen = false;
    if (props.imageURL) imageIsChosen = true;
    
    return(
        <div>
        {imageIsChosen ? (
            <img src={props.imageURL} alt={props.name} id="reference-image"></img>
        ) : (
            <div>
                <Panel bsStyle="warning" id="imagePanel">
                    <Panel.Heading>
                    <Panel.Title componentClass="h3">Oops! No Image</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>There is no background image selected. Choose one of the options below to get an image: </Panel.Body>
                    <div className="well">
                        <Button bsStyle="primary" block onClick={() => props.handleModal("my-images")}>
                        My Images
                        </Button>
                        <Button bsStyle="primary" block onClick={() => props.handleModal("image-gallery")}>
                        Image Gallery
                        </Button>
                        <Button bsStyle="primary" block onClick={() => props.handleModal("random")}>
                        Random Image
                        </Button>
                    </div>
                </Panel>
            </div>
        )}
        </div>
    )
}