import React, { useState } from "react";
import { LogoutSuccessAction, CartAction } from "../redux/actions";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FaCartPlus } from "react-icons/fa";
import { Icon } from "semantic-ui-react";

const logOutUser = () => {
  localStorage.clear();
  LogoutSuccessAction();
};

const Header = props => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  console.log(props.jumlahcart);
  return (
    <div>
      <Navbar color="blue" dark expand="md">
        <NavbarBrand href="/" style={{ fontWeight: "bold", fontSize: "30px" }}>
          Blue Movie
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink className="home" href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              {props.role === "admin" ? (
                <div className="mt-2 mr-3 ml-3 user d-flex">
                  <NavLink href={"/manageAdmin"}>Admin</NavLink>
                  <NavLink href={"/manageStudio"}>Manage Studio</NavLink>
                </div>
              ) : null}
            </NavItem>
            <NavItem>
              {props.authLogin ? null : (
                <NavLink>
                  <Link className="home" to={"/login"}>
                    Login
                  </Link>
                </NavLink>
              )}
            </NavItem>
            {props.AuthLog === "" ? (
              <NavItem>
                <Link to={"/login"} className="menu" />
              </NavItem>
            ) : null}
            {props.AuthLog === "" ? null : (
              <NavItem
                className="mt-2 mr-3 ml-3 user d-flex"
                style={{ color: "white" }}
              >
                Selamat Datang {props.AuthLog}
              </NavItem>
            )}
          </Nav>
          <Nav>
            {props.AuthLog === "" ? null : (
              <div>
                <NavItem className="logout d-flex">
                  <NavItem>
                    <Link to={"/cart"}>
                      {props.role === "user" ? (
                        <div>
                          <FaCartPlus
                            style={{ color: "white", fontSize: "20px" }}
                            className={"mt-2 mr-2 ml-2"}
                          />
                        </div>
                      ) : null}
                    </Link>
                    <NavItem className="pt-2 pl-2 txt-white">
                      {props.jumlahcart}
                    </NavItem>
                  </NavItem>
                  <NavItem style={{ color: "white" }}>
                    {props.Notifcart}
                  </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      {props.username}
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem divider />
                      <DropdownItem href="/history">
                        <NavLink
                          className="btn btn-primary"
                          style={{ color: "white" }}
                        >
                          History
                        </NavLink>
                      </DropdownItem>
                      <DropdownItem>
                        <NavLink
                          href="/"
                          onClick={() => logOutUser()}
                          style={{ color: "white" }}
                          className="btn btn-primary"
                        >
                          Logout
                        </NavLink>
                      </DropdownItem>
                      <DropdownItem href="/changepass">
                        <NavLink
                          className="btn btn-primary"
                          style={{ color: "white" }}
                        >
                          Change Password
                        </NavLink>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  {/* <NavLink
                    href="/"
                    onClick={() => logOutUser()}
                    className="btn btn-dark"
                  >
                    Logout
                  </NavLink> */}
                </NavItem>
              </div>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.username,
    jumlahcart: state.Auth.cart,
    role: state.Auth.role,
    authLogin: state.Auth.login,
    Notifcart: state.Auth.cart
  };
};

export default connect(MapstateToprops, { LogoutSuccessAction, CartAction })(
  Header
);
