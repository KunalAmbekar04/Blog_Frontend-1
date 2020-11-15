import "./Navbar.css";
import React, { Component, useState } from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faScroll,
  faUserCircle,
  faFeatherAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";

import { NavLink, Link } from "react-router-dom";

class NavItem extends Component {
  constructor(props) {
    super(props);
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.state = {
      isHovering: false,
    };
  }

  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering,
    };
  }

  render() {
    const activeClass =
      this.props.path === "/" || this.props.path === "#" ? "" : "active";
    return (
      <li className={this.props.className} onClick={this.handleMouseHover}>
        <NavLink to={this.props.path} activeClassName={activeClass}>
          {this.props.title}
        </NavLink>
        {this.props.children
          ? React.cloneElement(this.props.children, {
              isActive: this.state.isHovering,
            })
          : null}
      </li>
    );
  }
}

function DropdownMenu(props) {
  function DropdownItem(props) {
    return (
      <Link
        to="#"
        className="dropdown-item"
        style={{
          color: "black",
        }}
      >
        {props.children}
        <span className="dropdown-right-icon">
          <FontAwesomeIcon icon={props.icon} />
        </span>
      </Link>
    );
  }
  return (
    <div
      className={classnames("dropdownMenu", {
        "dropdownMenu--active": props.isActive,
      })}
    >
      <DropdownItem icon={faUserCircle}>Profile</DropdownItem>
      <DropdownItem icon={faScroll}>Your Drafts</DropdownItem>
      <DropdownItem icon={faFeatherAlt}>Saved Stories</DropdownItem>
      <DropdownItem icon={faSignOutAlt}>Logout</DropdownItem>
    </div>
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
            <NavItem title="write" path="/new-story" />
            <NavItem title="Log in" path="/login" />
            <NavItem title="Get Started" path="/signup" />
            <NavItem title="User" path="#" className="user-nav-item">
              {/* Dropdown goes here */}
              <DropdownMenu />
            </NavItem>
          </ul>
          <Burger showSideBar={this.showSideBar} />
        </nav>
      </header>
    );
  }
}

export default Navbar;
