import React, { Component } from "react";
import { Button, Glyphicon, Row, Col, Panel } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./style.css";

export default class About extends Component {
  render() {
    return (
          <div className="container">
            <Row id="demo">
                <Col sm={12} md={12}>
                    <h2>Watch A Demo:</h2>
                </Col>
            </Row>
            <Row id="about">
                <Col sm={12} md={12}>
                    <h2>What is this thing anyway?</h2>
                    <p>Lyrebird is an app designed to bring people together with doodles.</p>
                    <p>Currently Lyrebird allows users to:
                        <ul>
                            <li>Draw individually</li>
                            <li>Upload images to use as references</li>
                            <li>Continue drawings started by other users</li>
                            <li>Play a drawing game with other users</li>
                        </ul>
                    </p>
                </Col>
            </Row>
            <Row id="credits">
                <Col sm={12} md={12}>
                    <h2>Reasons this app exists today</h2>
                    <p>Lyrebird relies heavily on the hard work of other developers.</p>
                    <p>Many thanks to:
                        <ul>
                            <li><a href="https://serverless-stack.com/" target="blank">Serverless Stack</a></li>
                            <li><a href="https://github.com/embiem/react-canvas-draw" target="blank">React Canvas Draw</a></li>
                            <li><a href="https://github.com/dulnan/lazy-brush" target="blank">Lazy Brush</a></li>
                            <li><a href="https://www.glyphicons.com/" target="blank">Glyphicons</a></li>
                            <li>A man name Dimitri Bilenkin and another man named Mike Green</li>
                        </ul>
                    </p>
                </Col>
            </Row>
          </div>
  );

  }
}