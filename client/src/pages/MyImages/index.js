import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import "./style.css";

export default class MyImages extends Component {
  state = {
    isLoading: true,
    images: []
  };

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
        return;
    }
  
    try {
        const images = await this.images();
        this.setState({ images });
    } catch (error) {
        alert(error);
    }
  
    this.setState({ isLoading: false });
  }
    
  images() {
    return API.get("lyrebird", "/images");
  }

  renderImagesList(images) {
    return [{}].concat(images).map(
      (image, i) =>
        i !== 0
          ? <LinkContainer
              key={image.imageId}
              to={`/images/${image.imageId}`}
            >
              <ListGroupItem header={image.content.name.trim().split("\n")[0]}>
                {"Created: " + new Date(image.createdAt).toLocaleString()}
              </ListGroupItem>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to="/images/new"
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> Add a new image
                </h4>
              </ListGroupItem>
            </LinkContainer>
    );
  }

  renderImages() {
    return (
      <div className="images">
        <PageHeader>Your Images</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderImagesList(this.state.images)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="MyImages">
        {this.props.isAuthenticated && this.renderImages()}
      </div>
    );
  }
}