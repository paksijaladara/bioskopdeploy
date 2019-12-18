import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow
} from "@material-ui/core";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Fade from "react-reveal/Fade";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Swal from "sweetalert2";

class Managestudio extends Component {
  state = {
    loading: true,
    datastudio: [],
    modaladd: false,
    modaledit: false,
    idDelete: -1,
    indexEdit: -1,
    idEdit: -1
  };

  componentDidMount() {
    Axios.get(`${APIURL}studios`)
      .then(res => {
        console.log(res.data, "datastudios");
        var data = res.data;
        this.setState({ datastudio: data, loading: false });
      })
      .catch(err => {
        console.log(err);
      });
  }
  onClickEditStudio = index => {
    var editStudio = this.state.datastudio;
    this.setState({
      indexEdit: index,
      modaledit: true,
      idEdit: editStudio[index.id]
    });
  };

  onClickSaveStudio = index => {
    var editStudio = [];
    var nama = this.refs.nama.value;
    var jumlahKursi = this.refs.jumlahKursi.value;
    var newdata = this.state.datastudio;
    var studiobaru = { nama: nama, jumlahKursi: jumlahKursi };
    newdata.splice(this.state.indexEdit, 1, studiobaru);
    Axios.put(`${APIURL}studios/${this.state.idEdit}`, studiobaru);
    this.setState({
      datastudio: newdata,
      modaledit: false,
      indexEdit: -1,
      idEdit: -1
    });
    Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: toast => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      }
    }).fire({
      icon: "success",
      title: "edit berhasil"
    });
  };
  onClickAddStudio = () => {
    var studio = this.refs.studio.value;
    var jumlahKursi = this.refs.kursi.value;
    var data = {
      nama: studio,
      jumlahKursi
    };

    console.log(studio);
    console.log(jumlahKursi);

    if (studio !== "" && jumlahKursi !== "") {
      Axios.post(`${APIURL}studios`, data)
        .then(res => {
          console.log("res", res);
          this.setState({ datastudio: res.data, modaladd: false });
          window.location.reload();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log("gagal");
    }
  };

  onClickdeleteStudio = index => {
    Swal.fire({
      title: "Yakin untuk menghapus" + this.state.datastudio[index].nama + "?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        var hapusdata = this.state.datastudio;
        this.setState({ idDelete: hapusdata[index]["id"] });
        Swal.fire("Deleted", "Berhasil dihapus", "success");
        Axios.delete(`${APIURL}studios/${this.state.idDelete}`)
          .then(() => {
            Axios.get(`${APIURL}studios`)
              .then(respon => {
                this.setState({ datastudio: respon.data });
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(error => {
            console.log(error);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Tidak jadi", "error");
      }
    });
  };

  renderstudios = () => {
    return this.state.datastudio.map((val, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{val.nama}</TableCell>
          <TableCell>{val.jumlahKursi}</TableCell>
          <TableCell>
            <button
              onClick={() => this.onClickEditStudio(index)}
              className="btn btn-success mr-2 ml-2"
            >
              Edit
            </button>
            <button
              className="btn btn-danger mr-2 ml-2"
              onClick={() => this.onClickdeleteStudio(index)}
            >
              Delete
            </button>
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const { datastudio, indexEdit } = this.state;
    if (this.state.loading) {
      return <div>Loading</div>;
    }
    // console.log(this.state.datastudio,'asdasdas')
    else {
      if (this.props.role !== "admin") {
        return <div> ERROORRRR </div>;
      } else {
        return (
          <div>
            {indexEdit === -1 ? null : (
              <Modal
                isOpen={this.state.modaledit}
                toggle={() => this.setState({ modaledit: false })}
              >
                <ModalHeader>EDIT STUDIOS</ModalHeader>
                <ModalBody>
                  <input
                    type="text"
                    defaultValue={datastudio[indexEdit].nama}
                    className="form-control inputaddstudio"
                    ref="nama"
                    placeholder="nama studio"
                  />
                  <input
                    type="number"
                    defaultValue={datastudio[indexEdit].jumlahKursi}
                    className="form-control inputaddstudio"
                    ref="jumlahKursi"
                    placeholder="jumlah kursi"
                  />
                </ModalBody>
                <ModalFooter>
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={this.onClickSaveStudio}
                  >
                    Save
                  </button>
                </ModalFooter>
              </Modal>
            )}
            <Modal
              isOpen={this.state.modaladd}
              toggle={() => this.setState({ modaladd: false })}
            >
              <ModalHeader>ADD STUDIOS</ModalHeader>
              <ModalBody>
                <input
                  type="text"
                  className="form-control inputaddstudio"
                  ref="studio"
                  placeholder="nama studio"
                />
                <input
                  type="number"
                  className="form-control inputaddstudio"
                  ref="kursi"
                  placeholder="jumlah kursi"
                />
              </ModalBody>
              <ModalFooter>
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={this.onClickAddStudio}
                >
                  Submit
                </button>
              </ModalFooter>
            </Modal>
            <button
              className="btn btn-success"
              style={{ margin: "10px" }}
              onClick={() => this.setState({ modaladd: true })}
            >
              {" "}
              add Data
            </button>
            <Fade>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Nama</TableCell>
                    <TableCell>Jumlah Kursi</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{this.renderstudios()}</TableBody>
              </Table>
            </Fade>
          </div>
        );
      }
    }
  }
}

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.login,
    Tambcart: state.tambahcart,
    userId: state.Auth.id,
    role: state.Auth.role
  };
};

export default connect(MapstateToprops)(Managestudio);
