import React, { useState, useEffect } from "react";

export default function Timer(props) {
    let [minutes, setMinutes] = useState(null);
    let [seconds, setSeconds] = useState(null);

    let secondsRemain = 30;
    // let timerId;

    function tick() {
        getMinutes();
        getSeconds();
        secondsRemain--;
    }

    function getMinutes() {
        setMinutes(Math.floor(secondsRemain / 60));
    }

    function getSeconds() {
        let minutesNum = Math.floor(secondsRemain / 60);
        let newSeconds = secondsRemain - (minutesNum * 60);
        if (newSeconds === 0 && minutesNum === 0) {
            // clearInterval(timerId);
            props.saveGame();
            // console.log("DONE");
        }
        if (newSeconds < 10) {
            newSeconds = "0" + newSeconds;
        }
        setSeconds(newSeconds);
    }

    useEffect(() => {
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <p>{minutes}:{seconds}</p>
    )
}