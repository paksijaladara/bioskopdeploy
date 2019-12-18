import React, { Component } from "react";
import { Button, Form } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import Slide from "react-reveal/Slide";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { ChangePassAction } from "./../redux/actions";

class ChangePass extends Component {
  state = {
    toHome: false
  };

  componentDidMount() {
    // console.log(this.props.usernamebaru);
  }

  handleChangePassClick = () => {
    var oldPass = this.refs.oldpass.value;
    var newPass = this.refs.newpass.value;
    var password = this.refs.confpass.value;
    var updatePass = {
      password,
      username: this.props.usernamebaru,
      role: this.props.role
    };
    console.log(updatePass);
    if (oldPass === "" || newPass === "" || password === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password Tidak Boleh Kosong!"
      });
    } else if (oldPass === newPass) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password Baru tidak boleh sama dgn password lama"
      });
    } else if (oldPass !== this.props.passuser) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password yang anda masukkan salah"
      });
    } else if (newPass !== password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "New Password dan konfirmasi password harus sama"
      });
    } else {
      Axios.put(`${APIURL}users/${this.props.userid}`, updatePass)
        .then(res => {
          // console.log(res.data);
          Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes"
          }).then(result => {
            if (result.value) {
              this.props.ChangePassAction(res.data);
              this.setState({ toHome: true });
              Swal.fire({
                icon: "success",
                title: "Your password has been Updated!",
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    if (this.state.toHome || this.props.userlog === false) {
      return <Redirect to="/" />;
    }
    return (
      <Slide bottom cascade>
        <center className="center">
          <div className="mx-auto mt-5" style={{ width: "30%" }}>
            <div className="text-center">
              <h1>Reset Password</h1>
            </div>
            <Form className="mt-5 mr-4 ml-4">
              <Form.Field>
                <label>Username</label>
                <input
                  disabled
                  placeholder={this.props.usernamebaru}
                  ref="user"
                  className="text-center"
                />
              </Form.Field>
              <Form.Field>
                <label>Old Password</label>
                <input placeholder="" type="password" ref="oldpass" />
              </Form.Field>
              <Form.Field>
                <label>New Password</label>
                <input placeholder="" type="password" ref="newpass" />
              </Form.Field>
              <Form.Field>
                <label>Re-enter New Password</label>
                <input placeholder="" type="password" ref="confpass" />
              </Form.Field>
              <br />
              <Button
                fluid
                color="instagram"
                type="submit"
                onClick={this.handleChangePassClick}
              >
                Change Password
              </Button>
            </Form>
          </div>
        </center>
      </Slide>
    );
  }
}

const MapstateToprops = state => {
  return {
    usernamebaru: state.Auth.username,
    userlog: state.Auth.login,
    userid: state.Auth.id,
    passuser: state.Auth.password,
    role: state.Auth.role
  };
};

export default connect(MapstateToprops, { ChangePassAction })(ChangePass);
