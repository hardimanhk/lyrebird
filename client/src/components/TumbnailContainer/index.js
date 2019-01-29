import React from "react";
import Thumbnail from "../Tumbnail";
import "./style.css";

export default function ThumbnailContainer(props) {
    console.log("thumbnail cont props " + props.imageNames);
    return(
        <div className="thumb-container">
        {props.images.map((image, i) => (
            <Thumbnail src={image} alt={props.imageNames[i]} setBackground={props.setBackground} />
        ))}
        </div>
    )  
}