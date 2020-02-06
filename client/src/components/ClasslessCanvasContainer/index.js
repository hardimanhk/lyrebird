import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import Toolbar from "../Toolbar";
import Image from "../Image";
import ImageModal from "../ImageModal";
import { API, Storage } from "aws-amplify";
import CanvasDraw from "react-canvas-draw";
import "./style.css";

const ClasslessCanvasContainer = (props) => {
    const [overlay, setOverlay] = useState(true);
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.44);
    const [canvasHeight, setCanvasHeight] = useState(600);
    const [brushRadius, setBrushRadius] = useState(10);
    const [lazyRadius, setLazyRadius] = useState(2);
    const [color, setColor] = useState("#ffc600");
    const [background, setBackground] = useState("");
    const [saveData, setSaveData] = useState(null);
    const [backgroundName, setBackgroundName] = useState("imageName");
    const [showModal, setModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [images, setImages] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [saveIsLoading, setSaveIsLoading] = useState(null);
    const [isColorChange, setIsColorChange] = useState(false);
    const [isDisplayed, setIsDisplayed] = useState(false);


    const canvasRef = useRef();
    const drawCanvasRef = useRef();
    let timerId;

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

    function colorChanger() {
        setIsColorChange(true);
        timerId = setInterval(() => {
            setColor({
              color: "#" + Math.floor(Math.random() * 16777215).toString(16)
            });
          }, 2000);
    }

    function cancelColorChange() {
        clearInterval(timerId);
        setIsColorChange(false);
    }

    useEffect(() => {
        if (props.isAuthenticated) {
            loadImages();
        }
        loadBackground();
        setIsLoading(false);
        setCanvasWidth(drawCanvasRef.current.offsetWidth - 2);
    }, []);

    return(
        <div>
            {overlay ? (
                <Row className="canvas-container">
                    <Col xs={12} md={2}>
                        <Toolbar 
                            overlay={overlay} 
                            setOverlay={setOverlay}
                            brushRadius={brushRadius}
                            handleInputChange={handleInputChange}
                            color={color}
                            setColor={setColor}
                            isDisplayed={isDisplayed}
                            setIsDisplayed={setIsDisplayed}
                            colorChanger={colorChanger}
                            cancelColorChange={cancelColorChange}
                            isColorChange={isColorChange}
                            saveCanvas={saveCanvas}
                            clear={clearCanvas}
                            undo={undo}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <div className="draw-canvas" ref={drawCanvasRef}>
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
                    </Col>
                </Row>
            ) : (
                <Row className="canvas-container">
                    <Col sm={12} md={5}>
                    <Image 
                        imageURL={background}
                        name={backgroundName}
                        handleModal={handleModal} 
                    />
                    </Col>
                    <Col sm={12} md={2}>
                    <Toolbar 
                        overlay={overlay} 
                        setOverlay={setOverlay}
                        brushRadius={brushRadius}
                        handleInputChange={handleInputChange}
                        color={color}
                        setColor={setColor}
                        isDisplayed={isDisplayed}
                        setIsDisplayed={setIsDisplayed}
                        colorChanger={colorChanger}
                        cancelColorChange={cancelColorChange}
                        isColorChange={isColorChange}
                        saveCanvas={saveCanvas}
                        clear={clearCanvas}
                        undo={undo}
                    />
                    </Col>
                    <Col sm={12} md={5}>
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
                    </Col>
                </Row>
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