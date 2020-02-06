import React from "react";
import reactCSS from "reactcss";
import { Button, Glyphicon, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { SketchPicker } from 'react-color';
import Popup from "reactjs-popup";
import "./style.css";

export default function Toolbar(props) {
    console.log(props);

    const styles = reactCSS({
        'default': {
          color: {
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            // background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
          },
          swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
          },
          popover: {
            position: 'absolute',
            zIndex: '2',
          },
          cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          },
        },
      });

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
        <Button bsSize="small" block onClick={() => props.setColor("#ffffff")}>
            <Glyphicon glyph="erase" />  Erase
        </Button>
        <div id="color-div">
        <div id="color" style={ styles.swatch } onClick={ () => props.setIsDisplayed(!props.isDisplayed) }>
          <div style={ styles.color } />
        </div>
        { props.isDisplayed ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ () => props.setIsDisplayed(false) }/>
          <SketchPicker color={ props.color } onChange={ (color) => props.setColor(color.hex) } />
        </div> : null }
        <Button bsSize="small" block>   
            <Glyphicon glyph="tint" />  Color 
        </Button>
        </div>
        {/* {props.isColorChange ? ( 
            <Button bsSize="small" block onClick={() => props.cancelColorChange()}>
                <Glyphicon glyph="tint" />  Cancel
            </Button>
        ) : (
            <Button bsSize="small" block onClick={() => props.colorChanger()}>
                <Glyphicon glyph="tint" />  Random
            </Button>
        )} */}
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