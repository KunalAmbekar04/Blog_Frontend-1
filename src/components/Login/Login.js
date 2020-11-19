import "./Login.css";
import React, { Component } from "react";
import Title from "../Title/Title";
import Navbar from "../Navbar/Navbar";
import UserManager from "../../Utils";
import LoginForm from "../Forms/LoginForm";

class Login extends Component {
  render() {
    if (UserManager.isLoggedin()) {
      return <div>Already Logged in</div>;
    }
    return (
      <div>
        <Navbar />
        <Title />
        <div className="backgroundBox">
          <div className="mainContainer">
            {/* First Form Section */}
            <section className="formWrapper">
              <LoginForm props={this.props} />
            </section>
            {/* Second image Section */}
            <div className="imageWrapper">
              <div className="imageMessage">
                <div className="imageText">
                  <h2>Start your journey now</h2>
                  <p>
                    Start create your amazing Content with us! Login into your
                    account now and start writing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
