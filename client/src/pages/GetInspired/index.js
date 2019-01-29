import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import CanvasDraw from "react-canvas-draw";
import Tappable from "react-tappable/lib/Tappable";
import "./style.css";

export default function GetInspired(props) {
    const [images, setImages] = useState([]);
    
    function loadCanvases() {
        return API.get("lyrebird", "/canvas");
    }

    async function getImages() {
        const canvases = await loadCanvases();
        console.log(JSON.stringify(canvases));
        setImages(canvases);
    }

    function draw(id) {
        console.log("Draw");
        props.history.push("/draw/" + id);
    }
    
    useEffect(() => {
        getImages();
    }, []);

    return(
        <div className="getInspired">
            <h1>GET INSPIRED</h1>
            <p>Click on an image to continue the drawing!</p>
            <div id="image-container">
                {images.map(image => {
                    return (
                        <Tappable onTap={() => draw(image.canvasId)} >
                            <div className="canvas" key={image.canvasId} onClick={() => draw(image.canvasId)} >
                                <CanvasDraw canvasHeight={170} canvasWidth={170} disabled={true} saveData={image.content.saveData} immediateLoading={true}  />
                            </div>
                        </Tappable>
                    )
                })}
            </div>
        </div>
    )
}
