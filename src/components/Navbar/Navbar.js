import "./Navbar.css";
import React, { Component } from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function NavItem(props) {
  return (
    <li className="nav-item">
      <a href="#">{props.title}</a>
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
          "navbar--opacity" : this.state.visible && (this.state.prevScrollpos >= 400)
        })}
      >
        <nav className="navbarContainer">
          <div className="navbarLogo">Logo</div>
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
            <NavItem title="Home" />
            <NavItem title="About" />
            <NavItem title="Portfolio" />
            <NavItem title="Contact" />
          </ul>
          <Burger showSideBar={this.showSideBar} />
        </nav>
      </header>
    );
  }
}

export default Navbar;