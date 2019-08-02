import React from "react";
import { Link, Redirect } from "react-router-dom";

import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

import Person from "@material-ui/icons/Person";
import Warning from "@material-ui/icons/Warning";

import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Popover from '@material-ui/core/Popover';

import "assets/css/custom-style.css"

import image from "assets/img/login.jpg";
import signupPageStyle from "assets/jss/material-kit-react/views/loginPage";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cardAnimaton: "cardHidden",
      username: "",
      password: "",
      userProfile: [],
      loginStatus: false,
      anchorEl: null,
    };
  }
  componentDidMount() {
    setTimeout(
      function () {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  }
  handleChange = name => e => {
    this.setState({
      ...this.state,
      [name]: e.target.value,
    })
  }

  handleSubmit = async e => {
    e.preventDefault();
    let url = 'https://jftjf-backend.herokuapp.com/signin'
    let data = {
      'name': this.state.username,
      'password': this.state.password
    }
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "content-Type": "application/json",
      }
    })
    let jsonData = await response.json()

    await localStorage.setItem('token', jsonData.token)
    if (jsonData.success === 'true') {
      this.setState({ loginStatus: true })
    } else {
      this.setState({ anchorEl: e.currentTarget })
      setTimeout(() => this.handleClose(), 2000)
    }
  }

  render() {
    const open = Boolean(this.state.anchorEl)
    const { classes, isLogin, clearToken, getWithToken, ...rest } = this.props;
    if (isLogin === true) {
      return <Redirect to="/" />
    }
    if (this.state.loginStatus === true) {
      getWithToken()
      return <Redirect to="/" />
    }
    return (
      <div>
        <Header
          absolute
          color="transparent"
          brand="Joy Foods"
          rightLinks={<HeaderLinks clearToken={clearToken} isLogin={isLogin} />}
          {...rest}
        />
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Popover
                  open={open}
                  anchorEl={this.state.anchorEl}
                  onClose={this.handleClose}
                  anchorReference="anchorEl"
                  anchorEl={{ top: 1000 }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                >
                  <SnackbarContent
                    message={
                      <span>
                        Incorrect username or password
                      </span>
                    }
                    close
                    color="warning"
                    icon={Warning}
                  />
                </Popover>
                <Card className={classes[this.state.cardAnimaton]}>
                  <CardHeader style={{ backgroundColor: "#4a895a", color: "white" }} className={classes.cardHeader}>
                    <h4>Login</h4>
                    <div className={classes.socialLine}>
                      <Button
                        justIcon
                        color="transparent"
                        onClick={() => getWithToken()}
                      >
                        <a
                          style={{ color: "white" }}
                          href="https://jftjf-backend.herokuapp.com/login/facebook"
                        >
                          <i className={"fab fa-facebook"} />
                        </a>
                      </Button>
                      <Button
                        justIcon
                        color="transparent"
                        onClick={() => getWithToken()}
                      >
                        <a
                          style={{ color: "white" }}
                          href="https://jftjf-backend.herokuapp.com/login/facebook"
                        >
                          <i className={"fab fa-instagram"} />
                        </a>
                      </Button>
                      <Button
                        justIcon
                        color="transparent"
                        onClick={() => getWithToken()}
                      >
                        <a
                          style={{ color: "white" }}
                          href="https://jftjf-backend.herokuapp.com/login/facebook"
                        >
                          <i className={"fab fa-google-plus-g"} />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <p className={classes.divider}>Or Be Classical</p>
                  <form className={`${classes.form} cardAcc`}>
                    <CardBody>
                      <CustomInput
                        labelText="Username"
                        id="username"
                        inputRootCustomClasses={classes.inputRootCustomClasses}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.formControl,
                        }}
                        inputProps={{
                          "aria-label": "username",
                          type: "text",
                          name: "username",
                          value: this.state.username,
                          autoFocus: true,
                          required: true,
                          onChange: this.handleChange('username'),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Person className={classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="Password"
                        id="password"
                        inputRootCustomClasses={classes.inputRootCustomClasses}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.formControl,
                        }}
                        inputProps={{
                          "aria-label": "password",
                          type: "password",
                          name: "password",
                          value: this.state.password,
                          required: true,
                          onChange: this.handleChange('password'),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          ),
                          autoComplete: "off"
                        }}
                      />
                    </CardBody>
                    <p className={classes.divider} style={{ marginTop: 0 }}><Link to={"/forget-pw"} style={{ color: "#4a895a" }}><b>Forget Password?</b></Link></p>
                    <p className={classes.divider} style={{ marginTop: 0 }}>Don't have an account? <Link to={"/register-page"} style={{ color: "#4a895a" }}><b>Register Now!</b></Link></p>
                    <CardFooter className={classes.cardFooter}>
                      <Button onClick={this.handleSubmit} style={{ backgroundColor: "#4a895a", color: "white" }} size="lg">
                        Let's Go
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          <Footer whiteFont />
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object
};

export default withStyles(signupPageStyle)(LoginPage);
