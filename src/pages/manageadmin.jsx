import React, { Component } from "react";
import Axios from "axios";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Fade
} from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { APIURL } from "../support/ApiUrl";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import { withStyle, makeStyle } from "@material-ui/core";

const Myswal = withReactContent(Swal);
class ManageAdmin extends Component {
  state = {
    datafilm: [],
    readmoreselected: false,
    modaladd: false,
    modaledit: false,
    indexedit: 0,
    jadwal: [12, 14, 16, 18, 20],
    iddelete: -1,
    datastudio: []
  };
  //  tambahkan disini
  componentDidMount() {
    Axios.get(`${APIURL}movies`)
      .then(res => {
        Axios.get(`${APIURL}movies`).then(res => {
          this.setState({ datafilm: res.data });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  // sampai sini
  //   splitini = (a = "") => {
  //     var b = a.split("").filter((val, index) => index <= 50);
  //     return b;
  //   };
  deleteMovie = index => {
    Myswal.fire({
      title: `Hapus  ${this.state.datafilm[index].title}`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        const datahapus = this.state.datafilm;
        this.setState({ iddelete: datahapus[index].id });
        Axios.delete(`${APIURL}movies/${this.state.iddelete}`).then(() => {
          Axios.get(`${APIURL}movies`)
            .then(res => {
              this.setState({ dataFilm: res.data });
            })
            .catch(err => {
              console.log(err);
            });
        });
        datahapus.splice(index, 1);
        Myswal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        Myswal.fire("Cancelled", "", "error");
      }
    });
  };
  onUpdateDataclick = () => {
    var jadwaltemplate = this.state.jadwal;
    var jadwal = [];
    var id = this.state.datafilm[this.state.indexedit].id;
    for (var i = 0; i < jadwaltemplate.length; i++) {
      if (this.refs[`editjadwal${i}`].checked) {
        jadwal.push(jadwaltemplate[i]);
      }
    }
    var iniref = this.refs;
    var title = iniref.edittitle.value;
    var image = iniref.editimage.value;
    var synopsys = iniref.editsynopsys.value;
    var sutradara = iniref.editsutradara.value;
    var genre = iniref.editgenre.value;
    var durasi = iniref.editdurasi.value;
    var trailer = iniref.edittrailer.value;
    var studioId = iniref.editstudio.value;
    var produksi = "jaladara entertainment";
    var data = {
      title: title,
      image,
      synopsys,
      sutradara,
      genre,
      durasi,
      produksi,
      jadwal,
      trailer,
      studioId
    };
    console.log(id);
    Axios.put(`${APIURL}movies/${id}`, data)
      .then(() => {
        Axios.get(`${APIURL}movies/`)
          .then(res => {
            this.setState({ datafilm: res.data, modaledit: false });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };
  onSaveAddDataClick = () => {
    var jadwal = [12, 14, 16, 18, 20];
    var jadwaltemplate = [];
    for (var i = 0; i < jadwaltemplate.length; i++) {
      if (this.refs[`jadwal${i}`].checked) {
        jadwal.push(jadwaltemplate[i]);
      }
    }
    const iniref = this.refs;
    var title = iniref.title.value;
    var image = iniref.image.value;
    var synopsys = iniref.synopsys.value;
    var sutradara = iniref.sutradara.value;
    var genre = iniref.genre.value;
    var durasi = iniref.durasi.value;
    var trailer = iniref.trailer.value;
    var studioId = iniref.studio.value;
    var data = {
      title: title,
      sutradara,
      durasi,
      jadwal,
      synopsys,
      image,
      genre,
      trailer,
      studioId
    };

    if (
      title === "" ||
      image === "" ||
      synopsys === "" ||
      genre === "" ||
      jadwal === ""
    ) {
      Myswal.fire("Failed", "Data harus diisi semua", "error");
    } else {
      Myswal.fire("Berhasil", "Data berhasil dimasukkan", "success");

      Axios.post(`${APIURL}movies`, data)
        .then(() => {
          Axios.get(`${APIURL}movies`)
            .then(res => {
              this.setState({ datafilm: res.data, modaladd: false });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  renderMovies = () => {
    return this.state.datafilm.map((val, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{val.title}</TableCell>
          <TableCell>
            <img src={val.image} alt={"gambar"} height="200px" />
          </TableCell>
          {this.state.readmoreselected === index ? (
            <TableCell style={{ width: "300px" }}>
              {val.synopsys}
              <span
                style={{ color: "white" }}
                onClick={() => this.setState({ readmoreselected: -1 })}
              >
                Read less
              </span>
            </TableCell>
          ) : (
            <TableCell style={{ width: "300px" }}>
              {val.synopsys.split("").filter((val, index) => index <= 50)}
              <span
                style={{ color: "white" }}
                onClick={() => this.setState({ readmoreselected: index })}
              >
                Read More
              </span>
            </TableCell>
          )}

          <TableCell>{val.jadwal}</TableCell>
          <TableCell>{val.sutradara}</TableCell>
          <TableCell>{val.genre}</TableCell>
          <TableCell>{val.durasi}</TableCell>
          <TableCell>
            <button
              className="btn btn-outline-primary"
              onClick={() =>
                this.setState({ modaledit: true, indexedit: index })
              }
            >
              Edit
            </button>
            <button
              onClick={() => this.deleteMovie(index)}
              className="btn btn-outline-danger"
            >
              Delete
            </button>
          </TableCell>
        </TableRow>
      );
    });
  };

  renderEditCheckbox = indexedit => {
    var indexarr = [];
    var datafilmedit = this.state.datafilm[indexedit].jadwal;
    console.log(datafilmedit);
    // console.log(this.state.jadwal)
    // console.log(this.state.jadwal.indexOf(datafilmedit[1]))
    // datafilmedit.forEach((val)=>{
    //     indexarr.push(this.state.jadwal.indexOf(val))
    // })
    for (var i = 0; i < datafilmedit.length; i++) {
      for (var j = 0; j < this.state.jadwal.length; j++) {
        if (datafilmedit[i] === this.state.jadwal[j]) {
          indexarr.push(j);
        }
      }
    }
    var checkbox = this.state.jadwal;
    var checkboxnew = [];
    checkbox.forEach(val => {
      checkboxnew.push({ jam: val, tampiledit: false });
    });
    indexarr.forEach(val => {
      checkboxnew[val].tampiledit = true;
    });
    return checkboxnew.map((val, index) => {
      if (val.tampiledit) {
        return (
          <div key={index}>
            <input
              type="checkbox"
              defaultChecked
              ref={`editjadwal${index}`}
              value={val.jam}
            />
            <span className="mr-2">{val.jam}.00</span>
          </div>
        );
      } else {
        return (
          <div key={index}>
            <input type="checkbox" ref={`editjadwal${index}`} value={val.jam} />
            <span className="mr-2">{val.jam}.00</span>
          </div>
        );
      }
    });
  };
  renderAddCheckbox = () => {
    return this.state.jadwal.map((val, index) => {
      return (
        <div key={index}>
          <input type="checkbox" ref={`editjadwal${index}`} />
          <span className="mr-2">{val}.00</span>
        </div>
      );
    });
  };

  render() {
    const { datafilm, indexedit } = this.state;
    const { length } = datafilm;

    if (this.props.Auth.id === "") {
      return <Redirect to="/" />;
    }
    if (this.props.Auth.role !== "admin") {
      return <Redirect to="/404" />;
    }

    if (length === 0) {
      return <div>Loading</div>;
    }

    return (
      <div className="mx-3">
        <Modal
          isOpen={this.state.modaledit}
          toggle={() => this.setState({ modaledit: false })}
        >
          <ModalHeader>Edit data{datafilm[indexedit].title}</ModalHeader>
          <ModalBody>
            <input
              type="text"
              defaultValue={datafilm[indexedit].title}
              ref="edittitle"
              placeholder="title"
              className="form-control mt-2"
            />
            <input
              type="text"
              defaultValue={datafilm[indexedit].image}
              ref="editimage"
              placeholder="image"
              className="form-control mt-2"
            />
            <textarea
              rows="5"
              defaultValue={datafilm[indexedit].synopsys}
              ref="editsynopsys"
              placeholder="synopsys"
              className="form-control mt-2 mb-2"
            />
            Jadwal:
            <div className="d-flex">{this.renderEditCheckbox(indexedit)}</div>
            <input
              type="text"
              defaultValue={datafilm[indexedit].trailer}
              ref="edittrailer"
              placeholder="trailer"
              className="form-control mt-2"
            />
            <select ref="editstudio" className="form-control mt-2">
              <option value="1">Studio 1</option>
              <option value="2">Studio 2</option>
              <option value="3">Studio 3</option>
            </select>
            <input
              type="text"
              defaultValue={datafilm[indexedit].sutradara}
              ref="editsutradara"
              placeholder="sutradara"
              className="form-control mt-2"
            />
            <input
              type="text"
              defaultValue={datafilm[indexedit].genre}
              ref="editgenre"
              placeholder="genre"
              className="form-control mt-2"
            />
            <input
              type="number"
              defaultValue={datafilm[indexedit].durasi}
              ref="editdurasi"
              placeholder="durasi"
              className="form-control mt-2"
            />
          </ModalBody>
          <ModalFooter>
            <button
              onClick={this.onUpdateDataclick}
              className="btn btn-success mr-3"
            >
              Save
            </button>
            <button onClick={() => this.setState({ modaledit: false })}>
              Cancel
            </button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.modaladd}
          toggle={() => this.setState({ modaladd: false })}
        >
          <ModalHeader>Add data</ModalHeader>
          <ModalBody>
            <input
              type="text"
              ref="title"
              placeholder="title"
              className="form-control mt-2"
            />
            <input
              type="text"
              ref="image"
              placeholder="image"
              className="form-controlmt-2"
            />
            <input
              type="text"
              ref="synopsys"
              placeholder="synopsys"
              className="form-control mt-2 mb-2"
            />
            Jadwal:
            <div className="d-flex">{this.renderAddCheckbox()}</div>
            <input
              type="text"
              ref="trailer"
              placeholder="trailer"
              className="form-control mt-2"
            />
            <select ref="studio" className="form-control mt-2 ">
              <option value="1">Studio 1</option>
              <option value="2">Studio 2</option>
              <option value="3">Studio 3</option>
            </select>
            <input
              type="text"
              ref="sutradara"
              placeholder="sutradara"
              className="form-control"
            />
            <input
              type="text"
              ref="genre"
              placeholder="genre"
              className="form-control"
            />
            <input
              type="number "
              ref="durasi"
              placeholder="durasi"
              className="form-control"
            />
          </ModalBody>
          <ModalFooter>
            <button
              onClick={this.onSaveAddDataClick}
              className="btn btn-success mr-3"
            >
              Save
            </button>
            <button onClick={() => this.setState({ modaladd: false })}>
              Cancel
            </button>
          </ModalFooter>
        </Modal>
        <button
          className="btn btn-success"
          onClick={() => this.setState({ modaladd: true })}
        >
          Add data
        </button>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Judul</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Synopsis</TableCell>
              <TableCell>Jadwal</TableCell>
              <TableCell>Sutradara</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Durasi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.renderMovies()}</TableBody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    Auth: state.Auth
  };
};

export default connect(mapStateToProps)(ManageAdmin);
