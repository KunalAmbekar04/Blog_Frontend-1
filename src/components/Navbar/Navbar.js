import "./Navbar.css";
import React, { Component } from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

function NavItem(props) {
  const activeClass = props.path === "/" ? "" : "active";
  return (
    <li className="nav-items">
      <NavLink to={props.path} activeClassName={activeClass}>
        {props.title}
      </NavLink>
    </li>
  );
}

function Burger(props) {
  return (
    <div className="burger" onClick={props.showSideBar}>
      <div className="line1"></div>
      <div className="line2"></div>
      <div className="line3"></div>
    </div>
  );
}

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      prevScrollpos: window.pageYOffset,
      visible: true,
      sidebar: false,
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    let visible = currentScrollPos > 450;

    if (currentScrollPos <= 40) {
      visible = true;
    }

    this.setState({
      prevScrollpos: currentScrollPos,
      visible,
    });
  };

  showSideBar = () => {
    this.setState((prevState) => {
      return {
        sidebar: !prevState.sidebar,
      };
    });
  };

  render() {
    return (
      <header
        className={classnames("navbar", {
          "navbar--hidden": !this.state.visible && !this.state.sidebar,
          "navbar--opacity":
            this.state.visible && this.state.prevScrollpos >= 400,
        })}
      >
        <nav className="navbarContainer">
          <div className="navbarLogo">
            <NavLink to="/" activeClassName="">
              Logo
            </NavLink>
          </div>
          <ul
            className={classnames("navigationLinks", {
              "navbar--active": this.state.sidebar,
            })}
          >
            <li className="sidebarBanner">
              <div className="closeButton" onClick={this.showSideBar}>
                <FontAwesomeIcon
                  icon={faTimes}
                  size="2x"
                  style={{ color: "white" }}
                />
              </div>
            </li>
            <NavItem title="Home" path="/" />
            <NavItem title="Our Story" path="/post" />
            <NavItem title="Log in" path="/login" />
            <NavItem title="Get Started" path="/signup" />
          </ul>
          <Burger showSideBar={this.showSideBar} />
        </nav>
      </header>
    );
  }
}

export default Navbar;
