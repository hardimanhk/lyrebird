import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoadingButton";
import config from "../../config";
import { API } from "aws-amplify";
import "./style.css";
import { s3Upload } from "../../libraries/awsLibrary";

export default class NewImage extends Component {
    file = null;

    state = {
      isLoading: null,
      name: "",
      content: ""
    };


  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
      return;
    }

    this.setState({ isLoading: true });

    try {
      const attachment = this.file
        ? await s3Upload(this.file, "private")
        : null;

      await this.createNote({
        attachment,
        content: {
          name: this.state.name, 
          description: this.state.content
        }
      });
      this.props.history.push("/");
      } catch (error) {
        alert(error);
        this.setState({ isLoading: false });
      }
    }
    
  createNote(image) {
      return API.post("lyrebird", "/images", {
      body: image
      });
  }

  render() {
    return (
      <div className="NewImage">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="name">
          <ControlLabel>Image Name</ControlLabel>
            <FormControl
              type="text"
              onChange={this.handleChange}
              value={this.state.name}
            />
          </FormGroup>
          <FormGroup controlId="content">
          <ControlLabel>Image Description</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}