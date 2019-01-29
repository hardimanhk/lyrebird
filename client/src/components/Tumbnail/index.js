import React from "react";
import "./style.css";

export default function Thumbnail(props) {
    return (
        <div>
            <img src={props.src} alt={props.alt} className="click-card" onClick={() => props.setBackground(props.src)} />
        </div>
    )
}