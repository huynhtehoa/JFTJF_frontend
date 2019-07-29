import React from "react";
import { Link, Redirect } from "react-router-dom";

import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

import Email from "@material-ui/icons/Email";
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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Popover from '@material-ui/core/Popover';

import signupPageStyle from "assets/jss/material-kit-react/views/loginPage";

import "assets/css/custom-style.css"

import image from "assets/img/register.jpg";


class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      checked: [21],
      userProfile: [],
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      isChecked: true,
      isMatch: true,
      isValid: true,
      isEmailExist: false,
      isUsernameExist: false,
      isUsernameShort: false,
      isPasswordShort: false,
      isFinished: false,
      isRegistered: false,
      anchorEl: null,
    };
  }
  componentDidMount() {
    setTimeout(
      function () {
        this.setState({ ...this.state, cardAnimaton: "" });
      }.bind(this),
      700
    );
    this.getAllUser()
  }

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  }

  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
      isChecked: !this.state.isChecked
    });
  }
  handleChange = name => e => {
    this.setState({
      ...this.state,
      [name]: e.target.value
    })
  }

  handleSubmit = e => {
    this.getAllUser()
    const { username, email, password, confirmPassword, userProfile } = this.state

    if (password.length < 3) {
      this.setState({
        isPasswordShort: true,
        anchorEl: e.currentTarget
      })
      setTimeout(() => this.handleClose(), 1500)
    } else {
      this.setState({
        isPasswordShort: false,
        anchorEl: null
      })
    }

    if (password !== confirmPassword) {
      this.setState({
        isMatch: false,
        anchorEl: e.currentTarget
      })
      setTimeout(() => this.handleClose(), 1500)
    } else {
      this.setState({
        isMatch: true,
        anchorEl: null
      })
    }

    if (username.length < 3 || /^\s*$/.test(username) == true) {
      this.setState({
        isUsernameShort: true,
        anchorEl: e.currentTarget
      })
      setTimeout(() => this.handleClose(), 1500)
    } else {
      this.setState({
        isUsernameShort: false,
        anchorEl: null
      })
    }

    for (let i = 0; i < userProfile.length; i++) {
      if (userProfile[i].name == username) {
        this.setState({
          isUsernameExist: true,
          anchorEl: e.currentTarget
        })
        setTimeout(() => this.handleClose(), 1500)
        break;
      } else {
        this.setState({
          isUsernameExist: false,
          anchorEl: null
        })
      }
    }

    for (let i = 0; i < userProfile.length; i++) {
      if (userProfile[i].email == email) {
        this.setState({
          isEmailExist: true,
          anchorEl: e.currentTarget
        })
        setTimeout(() => this.handleClose(), 1500)
        break;
      } else {
        this.setState({
          isEmailExist: false,
          anchorEl: null
        })
      }
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false) {
      this.setState({
        isValid: false,
        anchorEl: e.currentTarget
      })
      setTimeout(() => this.handleClose(), 1500)
    } else {
      this.setState({
        isValid: true,
        anchorEl: null
      })
    }

    this.setState({
      isFinished: true,
    }, () => this.allTrueFunction())
  }
  addUser = async () => {
    let url = 'https://jftjf-backend.herokuapp.com/adduser'
    let data = {
      'name': this.state.username,
      'email': this.state.email,
      'password': this.state.password
    }
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "content-Type": "application/json",
        "Authorization": `Token ${this.props.token}`
      }
    })
  }
  allTrueFunction = () => {
    const { isChecked, isMatch, isValid, isEmailExist, isUsernameExist, isPasswordShort, isUsernameShort } = this.state

    if (isMatch === true && isUsernameExist === false && isEmailExist === false && isValid === true && isChecked === true && isPasswordShort == false && isUsernameShort == false) {
      this.addUser()
      this.setState({
        isRegistered: true,
      })
    } else {
      this.setState({
        isFinished: false,
      })
    }
  }
  getAllUser = async () => {
    let url = 'https://jftjf-backend.herokuapp.com/getuser'
    let response = await fetch(url)
    let data = await response.json()

    this.setState({
      userProfile: data.users
    })
  }

  render() {
    const { classes, isLogin, ...rest } = this.props;
    const { anchorEl, isChecked, isMatch, isValid, isEmailExist, isUsernameExist, isPasswordShort, isUsernameShort, isRegistered, cardAnimaton } = this.state
    const open = Boolean(anchorEl)

    if (isLogin === true) return <Redirect to="/" />

    const Message = () => {
      if (isUsernameShort) {
        return 'Username must contain more than 3 character'
      } else if (isUsernameExist) {
        return 'Username already exist'
      } else if (isValid === false) {
        return 'Incorrect email format'
      } else if (isEmailExist) {
        return 'Email already exists'
      } else if (isPasswordShort) {
        return 'Password must contain more than 3 characters'
      } else if (isMatch === false) {
        return 'Password unmatched'
      } else if (isChecked === false) {
        return 'You need to agree to terms of service to get started'
      }
    }

    if (isRegistered) return <Redirect to='/login-page' />
    return (
      <div>
        <Header
          fixed
          changeColorOnScroll={{
            height: 150,
            color: "white"
          }}
          color="transparent"
          brand="Joy Foods"
          rightLinks={<HeaderLinks />}
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
              <Popover
                open={open}
                anchorEl={anchorEl}
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
                  message={<Message />}
                  close
                  color="warning"
                  icon={Warning}
                />
              </Popover>
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[cardAnimaton]}>
                  <form className={`${classes.form} cardAcc cardReg`}>
                    <CardHeader style={{ backgroundColor: "#4a895a", color: "white" }} className={classes.cardHeader}>
                      <h4>Register Now</h4>
                    </CardHeader>
                    <CardBody style={{ paddingTop: 0 }}>
                      <CustomInput
                        labelText="Username"
                        id="username"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: "username",
                          type: "text",
                          value: this.state.username,
                          onChange: this.handleChange('username'),
                          autoFocus: true,
                          required: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Person className={classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="Email"
                        id="email"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: "email",
                          type: "email",
                          value: this.state.email,
                          onChange: this.handleChange('email'),
                          required: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="Password"
                        id="password"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: "password",
                          type: "password",
                          required: true,
                          value: this.state.password,
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
                      <CustomInput
                        labelText="Confirm Password"
                        id="confirm-password"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: "confirm-password",
                          type: "password",
                          required: true,
                          value: this.state.confirmPassword,
                          onChange: this.handleChange('confirmPassword'),
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
                      <br />
                      <div style={{ textAlign: "center" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            checked={
                              this.state.checked.indexOf(21) !== -1 ? true : false
                            }
                            onClick={() => this.handleToggle(21)}
                            checkedIcon={<Check className="checkedIcon" />}
                            icon={<Check className="uncheckedIcon" />}
                          />
                        }
                        label="I agree to all the terms of service."
                      />
                      </div>
                      <br />
                    </CardBody>
                    <p className={classes.divider} style={{ marginTop: 0 }}>Already have an account? <Link to={"/login-page"} style={{ color: "#4a895a" }}><b>Log In Now!</b></Link></p>
                    <CardFooter className={classes.cardFooter}>
                      <Button onClick={this.handleSubmit} style={{ backgroundColor: "#4a895a", color: "white" }} size="lg">
                        Get Started
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          <Footer whiteFont />
        </div>
      </div >
    );
  }
}

RegisterPage.propTypes = {
  classes: PropTypes.object
};

export default withStyles(signupPageStyle)(RegisterPage);
