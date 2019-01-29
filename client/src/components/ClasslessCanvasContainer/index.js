import React, { useState, useEffect, useRef } from "react";
import Toolbar from "../Toolbar";
import Image from "../Image";
import ImageModal from "../ImageModal";
import { API, Storage } from "aws-amplify";
import CanvasDraw from "react-canvas-draw";
import { s3Upload } from "../../libraries/awsLibrary";
import "./style.css";
import { ConsoleLogger } from "@aws-amplify/core";

const ClasslessCanvasContainer = (props) => {
    const [overlay, setOverlay] = useState(true);
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.44);
    const [canvasHeight, setCanvasHeight] = useState(600);
    const [brushRadius, setBrushRadius] = useState(10);
    const [lazyRadius, setLazyRadius] = useState(2);
    const [color, setColor] = useState("ffc600");
    const [background, setBackground] = useState("");
    const [saveData, setSaveData] = useState(null);
    const [backgroundName, setBackgroundName] = useState("imageName");
    const [showModal, setModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [images, setImages] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [saveIsLoading, setSaveIsLoading] = useState(null);

    const canvasRef = useRef();

    function handleModal(content) {
        setModal(true);
        setModalContent(content);
    }

    function handleInputChange(event) {
        event.preventDefault();
        setBrushRadius(event.target.value);
    }

    async function saveCanvas() {
        setSaveIsLoading(true);
        let dataToSave = canvasRef.current.getSaveData();
        try {
            await createOrUpdateCanvas({
                content: {
                    saveData: dataToSave,
                    name: "smiley",
                    description: "a terrible smiley face"
                }
            });
        } catch(error) {
            alert(error);
            setSaveIsLoading(false);
        }

    }

    function createOrUpdateCanvas(canvas) {
        if(props.match.background) {
            return API.put("lyrebird", `/canvas/${props.match.background}`, {
                body: canvas
            });
        }
        return API.post("lyrebird", "/canvas", {
            body: canvas
        });
    }

    function requestImages() {
        return API.get("lyrebird", "/images");
    }

    function getCanvas() {
        return API.get("lyrebird", `/canvas/${props.match.background}`);
    }

    function imageAttachments(someImages) {
        const imageURLs = [];
        someImages.map(image => Storage.vault.get(image.attachment).then(result => imageURLs.push(result)));
        console.log("image urls" + imageURLs);
        return imageURLs;
    }

    async function loadImages() {
        try {
            const requestedImages = await requestImages();
            const requestAttachments = await imageAttachments(requestedImages);
            setImages(requestedImages);
            setAttachments(requestAttachments);
        } catch(error) {
            alert(error);
        }
    }

    async function loadBackground() {
        if (props.match.background) {
            try {
                const newBackground = await getCanvas();
                setSaveData(newBackground.content.saveData);
            } catch(error) {
                alert(error);
            }
        }
    }
    
    function clearCanvas() {
        canvasRef.current.clear();
    }

    function undo() {
        canvasRef.current.undo();
    }

    useEffect(() => {
        loadImages();
        loadBackground();
        setIsLoading(false);
    }, []);

    return(
        <div>
            {overlay ? (
                <div className="canvas-container">
                    <Toolbar 
                        overlay={overlay} 
                        setOverlay={setOverlay}
                        brushRadius={brushRadius}
                        handleInputChange={handleInputChange}
                        setColor={setColor}
                        saveCanvas={saveCanvas}
                        clear={clearCanvas}
                        undo={undo}
                    />
                    <div className="draw-canvas">
                    <CanvasDraw  
                        ref={canvasRef}
                        canvasWidth={canvasWidth}
                        canvasHeight={canvasHeight}
                        brushRadius={brushRadius}
                        lazyRadius={lazyRadius}
                        brushColor={color}
                        saveData={saveData}
                        imgSrc={background}
                    />
                    </div>
                </div>
            ) : (
                <div className="canvas-container">
                    <Image 
                        imageURL={background}
                        name={backgroundName}
                        handleModal={handleModal} 
                    />
                    <Toolbar 
                        overlay={overlay} 
                        setOverlay={setOverlay}
                        brushRadius={brushRadius}
                        handleInputChange={handleInputChange}
                        setColor={setColor}
                        saveCanvas={saveCanvas}
                        clear={clearCanvas}
                        undo={undo}
                    />
                    <div className="draw-canvas">
                     <CanvasDraw 
                        ref={canvasRef}
                        canvasWidth={canvasWidth}
                        canvasHeight={canvasHeight}
                        brushRadius={brushRadius}
                        lazyRadius={lazyRadius}
                        brushColor={color}
                        saveData={saveData}
                        imgSrc={""}
                    />
                    </div>
                </div>
            )}  
            <ImageModal 
                show={showModal} 
                onHide={() => setModal(false)} 
                content={modalContent}
                images={images}
                attachments={attachments}
                isLoading={isLoading}
                setBackground={setBackground}
                setBackgroundName={setBackgroundName}
            />           
        </div>
    )
}

export default ClasslessCanvasContainer;