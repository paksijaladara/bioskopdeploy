import React, { Component } from "react";
import Header from "./components/header";
import Home from "./pages/home";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import ManageAdmin from "./pages/manageadmin";
import ReactSlick from "./support/reactSlict";
import Login from "./pages/login";
import { connect } from "react-redux";
import RegisterUser from "./pages/RegisterUser";
import MovieDetail from "./pages/movie-detail";
import { LoginSuccessAction, CartAction } from "./redux/actions";
import Axios from "axios";
import { APIURL } from "./support/ApiUrl";
import Belitiket from "./pages/belitiket";
import Cart from "./pages/cart";
import Pagenotfound from "./pages/pagenotfound";
import Changepass from "./pages/changepass";
import Managestudio from "./pages/manageStudio";
import History from "./pages/history";

class App extends Component {
  state = {
    loading: true,
    datacart: []
  };

  componentDidMount() {
    var id = localStorage.getItem("kunci");
    Axios.get(`${APIURL}users/${id}`)
      .then(res => {
        this.props.LoginSuccessAction(res.data);
        Axios.get(`${APIURL}orders?userId=${id}`)
          .then(res1 => {
            // var datacart = res1.data;
            // this.setState({ datacart: datacart, loading: false });
            this.props.CartAction(res1.data.length);
            console.log(res1.data.length);
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }
  render() {
    console.log(this.state.datacart.length);
    if (this.state.loading) {
      return <div>loading</div>;
    } else {
      this.props.CartAction(this.state.datacart.length);
      return (
        <div className="App">
          <Header />
          <Switch>
            <Route path={"/"} exact>
              <ReactSlick />
              <Home />
            </Route>
            <Route path={"/manageadmin"} exact>
              <ManageAdmin />
            </Route>
            <Route path="/moviedetail/:id" component={MovieDetail} exact />
            <Route path="/belitiket" component={Belitiket} exact />
            <Route path={"/login"} exact component={Login} />
            <Route path={"/RegisterUser"} exact component={RegisterUser} />
            <Route path="/cart" component={Cart} exact />
            <Route path={"/history"} component={History} exact />
            <Route exact path="/404" component={Pagenotfound} />
            <Route path={"/changepass"} component={Changepass} />
            <Route path={"/managestudio"} exact component={Managestudio} />
            <Route path="/*" component={Pagenotfound} />
          </Switch>
        </div>
      );
    }
  }
}

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.login,
    Notifcart: state.Auth.cart
  };
};

export default connect(MapstateToprops, { LoginSuccessAction, CartAction })(
  App
);
