import React from "react";
import { Redirect } from "react-router-dom";

import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

import Icon from "@material-ui/core/Icon";
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

import image from "assets/img/rspw.jpg";
import signupPageStyle from "assets/jss/material-kit-react/views/loginPage";

import "assets/css/custom-style.css"

class ResetPw extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardAnimaton: "cardHidden",
            password: "",
            confirmPassword: "",
            anchorEl: null,
            isMatch: true,
            isShort: false,
            isSuccess: false
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
            anchorEl: null,
            isMatch: true,
            isShort: false,
        });
    }
    handleChange = name => e => {
        this.setState({
            ...this.state,
            [name]: e.target.value
        })
    }

    handleSubmit = async e => {
        const { password, confirmPassword } = this.state;

        e.preventDefault();
        this.setState({
            anchorEl: e.currentTarget
        })

        if (password !== confirmPassword) {
            this.setState({
                isMatch: false
            })
        } else if (/^\s*$/.test(password)) {
            this.setState({
                isShort: true
            })
        } else {
            let token = (window.location.search.split("=")[0] === "?token_key") ? window.location.search.split("=")[1] : null
            let url = `https://jftjf-backend.herokuapp.com/resetwithtoken/${token}`
            let data = {
                'password': password,
            }
            await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    "content-Type": "application/json"
                }
            })
            this.setState({
                isSuccess: true
            })
        }

        setTimeout(() => this.handleClose(), 1500)
    }

    SnackBar = () => {
        if (this.state.isShort) {
            return <SnackbarContent
                message={
                    <span>
                        Password must contain more than 3 characters!
                    </span>
                }
                close
                color="warning"
                icon={Warning}
            />
        } else if (!this.state.isMatch) {
            return <SnackbarContent
                message={
                    <span>
                        Passwords do not match!
                    </span>
                }
                close
                color="warning"
                icon={Warning}
            />
        }
    }

    render() {
        const open = Boolean(this.state.anchorEl)
        const { classes, ...rest } = this.props;
        if (this.state.isSuccess) return <Redirect to="/login-page" />
        return (
            <div>
                <Header
                    absolute
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
                            <GridItem xs={12} sm={12} md={4}>
                                {(this.state.isShort === true || this.state.isMatch === false)
                                    &&
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
                                        <this.SnackBar />
                                    </Popover>
                                }
                                <Card className={classes[this.state.cardAnimaton]}>
                                    <CardHeader style={{ backgroundColor: "#4a895a", color: "white" }} className={classes.cardHeader}>
                                        <h4>New Password</h4>
                                    </CardHeader>
                                    <form className={`${classes.form} cardAcc`}>
                                        <CardBody>
                                            <CustomInput
                                                labelText="New Password"
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

                                        </CardBody>
                                        <CardFooter className={classes.cardFooter}>
                                            <Button onClick={this.handleSubmit} style={{ backgroundColor: "#4a895a", color: "white" }} size="lg">
                                                Send Now
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

ResetPw.propTypes = {
    classes: PropTypes.object
};

export default withStyles(signupPageStyle)(ResetPw);
