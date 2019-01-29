import React from "react";
import { Button, Glyphicon, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Popup from "reactjs-popup";
import "./style.css";

export default function Toolbar(props) {
    console.log(props);
    return(
        <div className="toolbar">
        {props.overlay ? (
            <Button bsSize="small" block onClick={() => props.setOverlay(false)}>
                <Glyphicon glyph="resize-horizontal" />  Separate
            </Button>
        ) : (
            <Button bsSize="small" block onClick={() => props.setOverlay(true)}>
                <Glyphicon glyph="resize-horizontal" />  Overlay
            </Button>
        )
        }
        <Button bsSize="small" block>
            <Glyphicon glyph="pencil" />  Brush
        </Button>
        <Popup trigger={
        <Button bsSize="small" block>
            <Glyphicon glyph="record" />  Size
        </Button>} 
        position="left center"
        closeOnDocumentClick
        closeOnEscape>
        <div>
            <form onSubmit={(event) => event.preventDefault()}>
            <FormGroup controlId="brushRadius" bsSize="large">
            <ControlLabel>Brush Size: </ControlLabel>
            <FormControl
              type="text"
              value={props.brushSize}
              onChange={props.handleInputChange}
            />
          </FormGroup>
            </form>
        </div>
        </Popup>
        <Button bsSize="small" block>
            <Glyphicon glyph="erase" />  Erase
        </Button>
        <div id="color-div">
        <input name="Color Picker" type="color" id="color"/> 
        <Button bsSize="small" block>   
            <Glyphicon glyph="tint" />  Color 
        </Button>
        </div>
        <Button bsSize="small" block onClick={() => props.colorChanger()}>
            <Glyphicon glyph="tint" />  Random
        </Button>
        <Button bsSize="small" block>
            <Glyphicon glyph="zoom-in" />  Zoom
        </Button>
        <Button bsSize="small" block onClick={() => props.clear()}> 
            <Glyphicon glyph="unchecked" />  Clear
        </Button>
        <Button bsSize="small" block onClick={() => props.undo()}> 
            <Glyphicon glyph="backward" />  Undo
        </Button>
        <Button bsSize="small" block onClick={() => props.saveCanvas()}>
            <Glyphicon glyph="floppy-disk" />  Save
        </Button>
        </div>
    );
}