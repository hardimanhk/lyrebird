import React from "react";
import "./style.css";
import ClasslessCanvasContainer from "../../components/ClasslessCanvasContainer";

function Draw(props) {
    return(
        <div className="draw">
            <ClasslessCanvasContainer match={props.match.params} />
        </div>
    )
}

export default Draw;