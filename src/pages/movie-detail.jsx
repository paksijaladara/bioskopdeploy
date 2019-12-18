import React, { Component } from "react";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class MovieDetail extends Component {
  state = {
    datadetailfilm: {},
    traileropen: false,
    notloginyet: false,
    kelogin: false,
    belitiketok: false
  };
  componentDidMount() {
    Axios.get(`${APIURL}movies/${this.props.match.params.id}`)
      .then(res => {
        this.setState({ datadetailfilm: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }
  onBeliTiketClick = () => {
    if (this.props.AuthLog) {
      this.setState({ belitiketok: true });
    } else {
      this.setState({ notloginyet: true });
    }
  };
  render() {
    if (this.state.kelogin) {
      return <Redirect to={"/login"} />;
    }
    if (this.state.belitiketok) {
      return (
        <Redirect
          to={{ pathname: "/belitiket", state: this.state.datadetailfilm }}
        />
      );
    }
    return (
      <div>
        <Modal
          isOpen={this.state.traileropen}
          size="lg"
          toggle={() => this.setState({ traileropen: false })}
          contentClassName="trailer"
          wrapClassName="trailer"
        >
          <ModalBody className="p-0 bg-transparent">
            <iframe
              width="100%"
              title={this.state.datadetailfilm.title}
              height="100%"
              src={this.state.datadetailfilm.trailer}
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.notloginyet}
          toggle={() => this.setState({ notloginyet: false })}
        >
          <ModalBody>anda tidak bisa lanjut ,silahkan login</ModalBody>
          <ModalFooter>
            <button onClick={() => this.setState({ kelogin: true })}>OK</button>
          </ModalFooter>
        </Modal>
        <div className="row p-3 mx-3 my-4">
          <div className="col-md-4 ">
            <img
              src={this.state.datadetailfilm.image}
              height="500"
              alt="film"
            />
            <div className="mt-3" style={{ fontSize: "30px" }}>
              {this.state.datadetailfilm.title}
            </div>
          </div>

          <div className="col-md-2">
            <div className="mt-1" style={{ color: "white" }}>
              title <span className="ml-4">:</span>
            </div>
            <div className="mt-1" style={{ color: "white" }}>
              synopsys<span className="ml-2">:</span>
            </div>
          </div>

          <div className="col-md-5">
            <div className="mt-1" style={{ color: "white" }}>
              {this.state.datadetailfilm.title}
            </div>
            <div className="mt-1" style={{ color: "white" }}>
              {this.state.datadetailfilm.synopsys}
            </div>
            <br></br>
            <div>
              <button
                className="mr-3 btn btn-primary"
                onClick={this.onBeliTiketClick}
              >
                Beli tiket
              </button>
              <button
                className="btn btn-outline-warning"
                onClick={() => this.setState({ traileropen: true })}
              >
                Trailer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.login
  };
};

export default connect(MapstateToprops)(MovieDetail);
