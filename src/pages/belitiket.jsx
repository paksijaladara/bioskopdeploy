import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Numeral from "numeral";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { Redirect } from "react-router-dom";

class Belitiket extends Component {
  state = {
    datamovie: {},
    seats: 260,
    baris: 0,
    booked: [],
    loading: true,
    jam: 12,
    pilihan: [],
    harga: 0,
    jumlahtiket: 0,
    openModalcart: false,
    redirectHome: false
  };

  componentDidMount() {
    this.onJamchange();
  }
  onJamchange = () => {
    var studioId = this.props.location.state.studioId;
    var movieId = this.props.location.state.id;
    Axios.get(`${APIURL}studios/${studioId}`)
      .then(res1 => {
        Axios.get(`${APIURL}orders?movieId=${movieId}&jadwal=${this.state.jam}`)
          .then(res2 => {
            var arrAxios = [];
            res2.data.forEach(val => {
              arrAxios.push(
                Axios.get(`${APIURL}ordersDetails?orderId=${val.id}`)
              );
            });
            var arrAxios2 = [];
            Axios.all(arrAxios)
              .then(res3 => {
                console.log("res3", res3);
                res3.forEach(val => {
                  arrAxios2.push(...val.data);
                });
                console.log(arrAxios2);
                this.setState({
                  datamovie: this.props.location.state,
                  seats: res1.data.jumlahKursi,
                  baris: res1.data.jumlahKursi / 20,
                  booked: arrAxios2,
                  loading: false
                });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err2 => {
            console.log(err2);
          });
      })
      .catch(err1 => {
        console.log(err1);
      });
  };
  onButtonjamclick = val => {
    this.setState({ jam: val, pilihan: [] });
    this.onJamchange();
  };
  clearSeat = () => {
    this.setState({ pilihan: [] });
  };

  onPilihSeatClick = (row, seat) => {
    var pilihan = this.state.pilihan;
    pilihan.push({ row, seat }); //seat:seat bisa juga ditulis begitu
    this.setState({ pilihan });
  };
  onOrderClick = () => {
    var userId = this.props.userId;
    var movieId = this.state.datamovie.id;
    var pilihan = this.state.pilihan;
    var jadwal = this.state.jam;
    var totalharga = this.state.pilihan.length * 25000;
    var bayar = false;
    var dataorders = { userId, movieId, totalharga, jadwal, bayar };

    Axios.post(`${APIURL}orders`, dataorders)
      .then(res => {
        console.log(res.data);
        var dataordersdetail = [];
        pilihan.forEach(val => {
          dataordersdetail.push({
            orderId: res.data.id,
            seat: val.seat,
            row: val.row
          });
        });
        var dataordersdetail2 = [];
        dataordersdetail.forEach(val => {
          dataordersdetail2.push(Axios.post(`${APIURL}ordersDetails`, val));
        });
        Axios.all(dataordersdetail2)
          .then(res1 => {
            this.setState({ openModalcart: true });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };
  onPilihSeat = (row, seat) => {
    var pilihan = this.state.pilihan;
    pilihan.push({ row: row, seat: seat });
    this.setState({ pilihan: pilihan });
  };

  renderHargadanQuantity = () => {
    var jumlahtiket = this.state.pilihan.length;
    var harga = jumlahtiket * 25000;
    // this.setState({ harga })
    return (
      <div>
        {jumlahtiket} tiket X {"Rp" + Numeral(25000).format("0,0.00")}=
        {"Rp" + Numeral(harga).format("0,0.00")}
      </div>
    );
  };

  onCancelseatClick = (row, seat) => {
    var pilihan = this.state.pilihan;
    var rows = row;
    var seats = seat;
    var arr = [];
    for (var i = 0; i < pilihan.length; i++) {
      if (pilihan[i].row !== rows || pilihan[i].seat !== seats) {
        arr.push(pilihan[i]);
      }
    }
    this.setState({ pilihan: arr });
  };

  renderseat = () => {
    var arr = [];
    for (let i = 0; i < this.state.baris; i++) {
      arr.push([]);
      for (let j = 0; j < this.state.seats / this.state.baris; j++) {
        arr[i].push(1);
      }
    }
    console.log("booked", this.state.booked);
    for (let j = 0; j < this.state.booked.length; j++) {
      arr[this.state.booked[j].row][this.state.booked[j].seat] = 3;
    }

    for (let a = 0; a < this.state.pilihan.length; a++) {
      arr[this.state.pilihan[a].row][this.state.pilihan[a].seat] = 2;
    }
    var alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
    var jsx = arr.map((val, index) => {
      return (
        <div key={index}>
          {val.map((val1, i) => {
            if (val1 === 3) {
              return (
                <button
                  key={i}
                  disabled
                  className="rounded btn-disble mr-2 mt-2 bg-danger text-center"
                >
                  {alphabet[index] + (i + 1)}
                </button>
              );
            } else if (val1 === 2) {
              return (
                <button
                  key={i}
                  onClick={() => this.onCancelseatClick(index, i)}
                  className="rounded btn-primary btn-order mr-2 mt-2 btn-pilih text-center"
                >
                  {alphabet[index] + (i + 1)}
                </button>
              );
            }
            return (
              <button
                key={i}
                onClick={() => this.onPilihSeatClick(index, i)}
                className="rounded btn-order mr-2 mt-2 text-center"
              >
                {alphabet[index] + (i + 1)}
              </button>
            );
          })}
        </div>
      );
    });
    return jsx;
  };
  renderbutton = () => {
    return this.state.datamovie.jadwal.map((val, index) => {
      if (this.state.jam === val) {
        return (
          <button key={index} className="mx-2 btn btn-outline-primary" disabled>
            {val}.00
          </button>
        );
      }
      return (
        <button
          key={index}
          className="mx-2 btn btn-outline-primary"
          onClick={() => this.onButtonjamclick(val)}
        >
          {val}.00
        </button>
      );
    });
  };

  toHome = () => {
    window.location.reload();
  };

  render() {
    if (this.props.location.state && this.props.AuthLog) {
      if (this.state.redirectHome) {
        return <Redirect to={"/"} />;
      }
      return (
        <div>
          <Modal isOpen={this.state.openModalcart}>
            <ModalBody>kursi berhasil di pilih</ModalBody>
            <ModalFooter>
              <button
                className="btn btn-dark"
                onClick={
                  this.toHome
                  // this.setState({ redirectHome: true });
                }
              >
                beli tiket
              </button>
            </ModalFooter>
          </Modal>
          <center className="mt-1">
            {this.state.loading ? null : this.renderbutton()}
            <div>
              {this.state.pilihan.length ? (
                <div>
                  <button
                    className="btn btn-primary mt-3 ml-2 mr-2"
                    onClick={this.onOrderClick}
                  >
                    Order
                  </button>
                  <button
                    onClick={this.clearSeat}
                    className="btn btn-primary mt-3 ml-2 mr-2"
                  >
                    Clear Seat
                  </button>
                </div>
              ) : null}
            </div>
            {this.state.pilihan.length ? this.renderHargadanQuantity() : null}
          </center>
          <div>{this.state.datamovie.title}</div>
          <div className="d-flex justify-content-center mt-4">
            <div>
              {this.state.loading ? null : this.renderseat()}
              <center>
                <div className="layar mt-4">layar</div>
              </center>
            </div>
          </div>
        </div>
      );
    }
    return <div>404 not found</div>;
  }
}

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.login,
    userId: state.Auth.id
  };
};
export default connect(MapstateToprops)(Belitiket);
