import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoadingButton from "../../components/LoadingButton";
import config from "../../config";
import { s3Upload } from "../../libraries/awsLibrary";
import "./style.css";

export default class Images extends Component {

    file = null;

    state = {
      isLoading: null,
      isDeleting: null,
      image: null,
      name: "",
      description: "",
      attachmentURL: null
    };

  async componentDidMount() {
    try {
      let attachmentURL;
      const image = await this.getImage();
      const { content, attachment } = image;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      this.setState({
        image,
        name: content.name,
        description: content.description,
        attachmentURL
      });
    } catch (error) {
      alert(error);
    }
  }

  getImage() {
    return API.get("lyrebird", `/images/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.name.length > 0  && this.state.description.length > 0;
  }
  
  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  
  handleFileChange = event => {
    console.log(event.target.files[0]);
    this.file = event.target.files[0];
  }
  
  saveImage(image) {
    return API.put("lyrebird", `/images/${this.props.match.params.id}`, {
      body: image
    });
  }
  
  handleSubmit = async event => {
    let attachment;
  
    event.preventDefault();
  
    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
      return;
    }
  
    this.setState({ isLoading: true });
  
    try {
      if (this.file) {
        attachment = await s3Upload(this.file);
        await Storage.vault.remove(this.state.image.attachment);
      }
  
      await this.saveImage({
        content: {
          name: this.state.name,
          description: this.state.description
        },
        attachment: attachment
      });
      this.props.history.push("/");
    } catch (error) {
      alert(error);
      this.setState({ isLoading: false });
    }
  }
  
  deleteImage() {
    return API.del("lyrebird", `/images/${this.props.match.params.id}`);
  }
  
  handleDelete = async event => {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );
  
    if (!confirmed) {
      return;
    }
  
    this.setState({ isDeleting: true });
  
    try {
      await Storage.vault.remove(this.state.image.attachment);
      await this.deleteImage();
      this.props.history.push("/");
    } catch (error) {
      alert(error);
      this.setState({ isDeleting: false });
    }
  }
  
  render() {
    return (
      <div className="Images">
        {this.state.image &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="name">
            <ControlLabel>Image Name</ControlLabel>
              <FormControl
                type="text"
                onChange={this.handleChange}
                value={this.state.name}
              />
            </FormGroup>
            <FormGroup controlId="description">
            <ControlLabel>Description</ControlLabel>
              <FormControl
                onChange={this.handleChange}
                value={this.state.description}
                componentClass="textarea"
              />
            </FormGroup>
            {this.state.image.attachment &&
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.attachmentURL}
                  >
                    {this.formatFilename(this.state.image.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>}
            <FormGroup controlId="file">
              {!this.state.image.attachment &&
                <ControlLabel>Attachment</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>
            <LoadingButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoadingButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>}
      </div>
    );
  }
}