import React, { Component } from "react";
import LazyHero from "react-lazy-hero";
import { Button, Glyphicon, Row, Col, Panel } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./style.css";

export default class Home extends Component {
  render() {
    return (
      <div id="lazyHero">
          <LazyHero 
          imageSrc="https://cdn-images-1.medium.com/max/1600/1*pl-pc3mMSKK8YinhrpkzYw.png"
          color="#000000"
          opacity={0.5}
          minHeight="93vh"
          isCentered={false}
          parallaxOffset={150}
          >
              <h1 id="title">Lyrebird</h1>
              <h4 id="albert">"Creativity is contageous, pass it on." -Albert Einstein </h4>
              <a href="#cards"><p id="get-started">GET STARTED<br></br><Glyphicon glyph="menu-down" /></p></a>
          </LazyHero>
          <div>
          <div>
            <Row id="cards">
              <Col xs={12} md={4} lg={4}>
              <LinkContainer to="/draw">
                <Panel bsStyle="success" className="home-panel">
                  <Panel.Heading>
                  <Panel.Title componentClass="h3">Get Drawing!</Panel.Title>
                  </Panel.Heading>
                  <Panel.Body>
                    Create works of art using an online canvas. You can also 
                    choose to use a reference image.
                  </Panel.Body>
                </Panel>
              </LinkContainer>
              </Col>
              <Col xs={12} md={4} lg={4}>
              <LinkContainer to="/get-inspired">
                <Panel bsStyle="success" className="home-panel">
                  <Panel.Heading>
                  <Panel.Title componentClass="h3">Get Inspired!</Panel.Title>
                  </Panel.Heading>
                  <Panel.Body>
                    Grab works of art others have started and add your own twist. 
                  </Panel.Body>
                </Panel>
              </LinkContainer>
              </Col>
              <Col xs={12} md={4} lg={4}>
              <LinkContainer to="/about">
                <Panel bsStyle="success" className="home-panel">
                  <Panel.Heading>
                  <Panel.Title componentClass="h3">Watch a Demo</Panel.Title>
                  </Panel.Heading>
                  <Panel.Body>
                    Wodering what all these other features are? Click here to see how it all works.
                  </Panel.Body>
                </Panel>
              </LinkContainer>
              </Col>
            </Row>
          </div>
          </div>
      </div>
  );

    // return ( 
    //   <Fragment>
    //     <div className="Home">
    //     </div>
    //     <div className="lander">
    //     <h1>Lyrebird</h1>
    //     <p>"Creativity is contageous, pass it on." -Albert Einstein</p>
    //     </div>
    //   </Fragment>
    // );
  }
}